import { useMemo } from "react"
import Addfriends from "@/components/layouts/Addfriends"
import AddItems from "@/components/layouts/AddItems"
import BillSettings from "@/components/layouts/BillSettings"
import PromptPaySettings from "@/components/layouts/PromptPaySettings"
import Summary from "@/components/layouts/Summary"
import ResetBill from "@/components/layouts/ResetBill"
import ThemeToggle from "@/components/layouts/ThemeToggle"
import Footer from "@/components/layouts/Footer"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { calculateBill } from "@/lib/calc"
import { createId } from "@/lib/id"

const DEFAULT_SETTINGS = { serviceCharge: false, vat: false }
const DEFAULT_PROMPTPAY = { id: "", name: "" }

// ข้อมูลเก่าที่ยังไม่มี id ให้เติม id ให้ เพื่อใช้แก้ไขรายการได้
const withIds = (items) => items.map((item) => (item.id ? item : { ...item, id: createId() }))

function Mainpage() {
  const [people, setPeople] = useLocalStorage("people", [])
  const [items, setItems] = useLocalStorage("items", [], withIds)
  const [settings, setSettings] = useLocalStorage("settings", DEFAULT_SETTINGS)
  const [promptPay, setPromptPay] = useLocalStorage("promptpay", DEFAULT_PROMPTPAY)

  const result = useMemo(() => calculateBill(people, items, settings), [people, items, settings])

  function addPerson(name) {
    setPeople([...people, name])
  }

  // ลบคนออกจากรายการที่เคยหารด้วย
  function removePerson(name) {
    setPeople(people.filter((p) => p !== name))
    setItems(items.map((item) => ({ ...item, sharedBy: item.sharedBy.filter((p) => p !== name) })))
  }

  function addItem(item) {
    setItems([...items, { ...item, id: createId() }])
  }

  function updateItem(id, changes) {
    setItems(items.map((item) => (item.id === id ? { ...item, ...changes } : item)))
  }

  function removeItem(id) {
    setItems(items.filter((item) => item.id !== id))
  }

  // ล้างบิล แต่จำเลขพร้อมเพย์ไว้ เพราะคนรับเงินมักเป็นคนเดิม
  function resetBill() {
    setPeople([])
    setItems([])
    setSettings(DEFAULT_SETTINGS)
  }

  return (
    // จอคอม (lg ขึ้นไป): แบ่ง 3 คอลัมน์ สูงพอดีหน้าจอ รายการยาว ๆ เลื่อนในกรอบของมันเอง
    <div className="mx-auto flex min-h-svh max-w-xl flex-col px-4 pb-10 lg:h-svh lg:max-w-7xl lg:px-6 lg:pb-5">
      <header className="sticky top-0 z-10 -mx-4 mb-2 flex shrink-0 items-center gap-2 bg-background/70 px-4 py-3 backdrop-blur lg:static lg:mx-0 lg:mb-1 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
        <img src="/favicon.svg" alt="" className="size-10 rounded-xl shadow-md shadow-orange-500/25" />
        <div className="mr-auto leading-tight">
          <h1 className="font-heading text-lg font-semibold">
            แบ่งบิล
            <span className="bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">กับเพื่อน</span>
          </h1>
          <p className="text-xs text-muted-foreground">หารค่าอาหารง่าย ๆ ไม่ต้องคิดเลข</p>
        </div>
        <ThemeToggle />
        <ResetBill onReset={resetBill} disabled={people.length === 0 && items.length === 0} />
      </header>

      <main className="flex flex-col gap-4 lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-3 lg:grid-rows-1">
        {/* มือถือ: ใช้ order เรียงการ์ดตามลำดับการใช้งาน / จอคอม: จัดเป็นคอลัมน์ */}
        <section className="contents lg:flex lg:min-h-0 lg:flex-col lg:gap-4 lg:overflow-y-auto">
          <Addfriends className="order-1 lg:shrink-0" people={people} onAdd={addPerson} onRemove={removePerson} />
          <BillSettings className="order-3 lg:shrink-0" settings={settings} onChange={setSettings} />
          <PromptPaySettings className="order-4 lg:shrink-0" promptPay={promptPay} onChange={setPromptPay} />
        </section>
        <AddItems
          className="order-2 lg:order-none lg:min-h-0"
          people={people}
          items={items}
          onAdd={addItem}
          onUpdate={updateItem}
          onRemove={removeItem}
        />
        <Summary
          className="order-5 lg:order-none lg:min-h-0"
          result={result}
          items={items}
          settings={settings}
          promptPay={promptPay}
        />
      </main>

      <Footer className="mt-6 shrink-0 lg:mt-3" />
    </div>
  )
}

export default Mainpage
