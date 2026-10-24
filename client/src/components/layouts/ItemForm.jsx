import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CATEGORIES, DEFAULT_CATEGORY, getCategory } from "@/constants/categories"
import { personTone } from "@/constants/tones"
import { cn } from "@/lib/utils"

// ฟอร์มรายการ ใช้ทั้งตอนเพิ่มใหม่และตอนแก้ไข
function ItemForm({ people, initialItem, submitLabel, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialItem?.title ?? "")
  const [price, setPrice] = useState(initialItem ? String(initialItem.price) : "")
  const [category, setCategory] = useState(initialItem ? getCategory(initialItem.category).id : DEFAULT_CATEGORY)
  const [selected, setSelected] = useState(initialItem?.sharedBy ?? [])
  const [touched, setTouched] = useState(false)

  const amount = Number(price)
  const errors = {
    title: title.trim() === "",
    price: !(amount > 0),
    selected: selected.length === 0,
  }
  const allSelected = people.length > 0 && people.every((p) => selected.includes(p))
  const presets = getCategory(category).presets

  // ติ๊ก / เอาติ๊กออก
  function toggleSelect(person) {
    if (selected.includes(person)) {
      setSelected(selected.filter((p) => p !== person))
    } else {
      setSelected([...selected, person])
    }
  }

  // เลือกทุกคน หรือ ล้างถ้าเลือกครบแล้ว
  function toggleAll() {
    setSelected(allSelected ? [] : [...people])
  }

  function submit() {
    setTouched(true)
    // ข้อมูลไม่ครบ -> ออกจากฟังก์ชันเลย (early return)
    if (errors.title || errors.price || errors.selected) return

    onSubmit({
      title: title.trim(),
      price: amount,
      category,
      // เรียงตามลำดับใน people เพื่อให้แสดงผลสม่ำเสมอ
      sharedBy: people.filter((p) => selected.includes(p)),
    })

    if (!initialItem) {
      setTitle("")
      setPrice("")
      setSelected([])
      setTouched(false)
    }
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="หมวดหมู่">
        {CATEGORIES.map((c) => {
          const active = c.id === category
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setCategory(c.id)}
              className={cn(
                "flex h-7 items-center gap-1 rounded-full px-2.5 text-xs font-medium transition-colors",
                active ? cn(c.tone.solid, "shadow-sm") : cn(c.tone.soft, "opacity-80 hover:opacity-100")
              )}
            >
              <c.icon className="size-3.5" />
              {c.label}
            </button>
          )
        })}
      </div>

      <div className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`ชื่อรายการ เช่น ${presets[0]}`}
          aria-invalid={touched && errors.title ? true : undefined}
          className="h-9"
        />
        <Input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="ราคา"
          aria-invalid={touched && errors.price ? true : undefined}
          className="h-9 w-28 shrink-0"
        />
      </div>

      {/* ชื่อรายการยอดนิยม กดแล้วเติมชื่อให้ */}
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setTitle(preset)}
            className={cn(
              "h-7 shrink-0 rounded-full border border-dashed px-2.5 text-xs text-muted-foreground transition-colors hover:border-solid hover:text-foreground",
              title === preset && "border-solid border-primary bg-primary/10 text-foreground"
            )}
          >
            {preset}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">ใครหารบ้าง</span>
          {people.length > 0 && (
            <Button type="button" variant="ghost" size="sm" onClick={toggleAll} className="text-primary">
              {allSelected ? "ล้างที่เลือก" : "เลือกทุกคน"}
            </Button>
          )}
        </div>

        {people.length === 0 ? (
          <p className="text-sm text-muted-foreground">เพิ่มเพื่อนก่อน แล้วค่อยเลือกคนหาร</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {people.map((person) => (
              <Label
                key={person}
                className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-2.5 font-normal transition-colors has-data-checked:border-primary has-data-checked:bg-primary/10"
              >
                <Checkbox
                  checked={selected.includes(person)}
                  onCheckedChange={() => toggleSelect(person)}
                />
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-semibold",
                    personTone(people, person).solid
                  )}
                >
                  {person.slice(0, 1)}
                </span>
                <span className="truncate">{person}</span>
              </Label>
            ))}
          </div>
        )}
        {touched && errors.selected && people.length > 0 && (
          <p className="text-xs text-destructive">เลือกคนหารอย่างน้อย 1 คน</p>
        )}
      </div>

      {amount > 0 && selected.length > 1 && (
        <p className="text-xs text-muted-foreground">
          ตกคนละ {(amount / selected.length).toLocaleString("th-TH", { maximumFractionDigits: 2 })} บาท
          (ก่อนเซอร์วิส/VAT)
        </p>
      )}

      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onCancel}>
            ยกเลิก
          </Button>
        )}
        <Button type="submit" size="lg" className="flex-1" disabled={people.length === 0}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default ItemForm
