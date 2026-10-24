import { BeerIcon, CakeIcon, CupSodaIcon, ReceiptIcon, UtensilsIcon } from "lucide-react"
import { TONES } from "@/constants/tones"

// หมวดหมู่รายการ พร้อมชื่อรายการยอดนิยมให้กดเลือกเร็ว ๆ
export const CATEGORIES = [
  {
    id: "food",
    label: "อาหาร",
    emoji: "🍛",
    icon: UtensilsIcon,
    tone: TONES.orange,
    presets: ["หมูกระทะ", "ชาบู", "ข้าวผัด", "ส้มตำ", "ไก่ทอด", "ต้มยำ", "พิซซ่า"],
  },
  {
    id: "drink",
    label: "เครื่องดื่ม",
    emoji: "🥤",
    icon: CupSodaIcon,
    tone: TONES.sky,
    presets: ["น้ำเปล่า", "น้ำแข็ง", "โค้ก", "ชาไทย", "กาแฟ", "น้ำผลไม้"],
  },
  {
    id: "alcohol",
    label: "เหล้า/เบียร์",
    emoji: "🍺",
    icon: BeerIcon,
    tone: TONES.amber,
    presets: ["เบียร์", "เหล้า", "โซดา", "มิกเซอร์", "ไวน์", "ค็อกเทล"],
  },
  {
    id: "dessert",
    label: "ของหวาน",
    emoji: "🍰",
    icon: CakeIcon,
    tone: TONES.pink,
    presets: ["บิงซู", "ไอศกรีม", "เค้ก", "ขนมปังปิ้ง", "ผลไม้"],
  },
  {
    id: "other",
    label: "อื่น ๆ",
    emoji: "🧾",
    icon: ReceiptIcon,
    tone: TONES.violet,
    presets: ["ค่าเดินทาง", "ค่าที่พัก", "ค่าน้ำมัน", "ค่าตั๋ว", "ค่าจอดรถ"],
  },
]

export const DEFAULT_CATEGORY = "food"

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES.find((c) => c.id === "other")
}
