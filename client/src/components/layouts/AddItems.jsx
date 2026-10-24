import { useState } from "react"
import { AlertTriangleIcon, PencilIcon, ShoppingBasketIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import ItemForm from "@/components/layouts/ItemForm"
import SectionIcon from "@/components/layouts/SectionIcon"
import { getCategory } from "@/constants/categories"
import { TONES } from "@/constants/tones"
import { formatBaht } from "@/lib/calc"
import { cn } from "@/lib/utils"

function AddItems({ people, items, onAdd, onUpdate, onRemove, className }) {
  const [editing, setEditing] = useState(null)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SectionIcon icon={ShoppingBasketIcon} tone={TONES.orange} />
          รายการ
        </CardTitle>
        <CardDescription>เลือกหมวด ใส่ชื่อ ราคา แล้วเลือกคนที่หาร</CardDescription>
        <CardAction>
          <Badge variant="secondary">{items.length} รายการ</Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
        <ItemForm people={people} submitLabel="เพิ่มรายการ" onSubmit={onAdd} />

        {items.length > 0 && (
          <>
            <Separator />
            {/* จอคอม: เลื่อนดูรายการในกรอบนี้แทนการเลื่อนทั้งหน้า */}
            <ul className="-mx-4 min-h-0 flex-1 divide-y overflow-y-auto px-4 lg:-mb-4 lg:pb-2">
              {items.map((item) => {
                const category = getCategory(item.category)
                return (
                  <li key={item.id} className="flex items-center gap-2.5 py-2.5 first:pt-0">
                    <span
                      className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", category.tone.soft)}
                      title={category.label}
                    >
                      <category.icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate font-medium">{item.title}</span>
                        <span className="shrink-0 font-medium tabular-nums">{formatBaht(item.price)} ฿</span>
                      </div>
                      {item.sharedBy.length > 0 ? (
                        <p className="truncate text-xs text-muted-foreground">
                          {item.sharedBy.length === people.length && people.length > 1
                            ? `หารทุกคน (${item.sharedBy.length} คน)`
                            : item.sharedBy.join(", ")}
                        </p>
                      ) : (
                        <p className="flex items-center gap-1 text-xs text-destructive">
                          <AlertTriangleIcon className="size-3" />
                          ยังไม่มีคนหาร กดแก้ไขเพื่อเลือก
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditing(item)}
                        aria-label={`แก้ไข ${item.title}`}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => onRemove(item.id)}
                        aria-label={`ลบ ${item.title}`}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </CardContent>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไขรายการ</DialogTitle>
            <DialogDescription>เปลี่ยนหมวด ชื่อ ราคา หรือคนที่หารได้</DialogDescription>
          </DialogHeader>
          {editing && (
            <ItemForm
              key={editing.id}
              people={people}
              initialItem={editing}
              submitLabel="บันทึก"
              onSubmit={(changes) => {
                onUpdate(editing.id, changes)
                setEditing(null)
              }}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default AddItems
