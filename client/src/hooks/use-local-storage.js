import { useEffect, useState } from "react"

const PREFIX = "checkbill:"

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

// เหมือน useState แต่บันทึกค่าลง localStorage ให้อัตโนมัติ
export function useLocalStorage(key, initialValue, migrate = (v) => v) {
  const [value, setValue] = useState(() => migrate(read(key, initialValue)))

  useEffect(() => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      // พื้นที่เต็มหรือโหมดส่วนตัว: ใช้งานต่อได้แค่ไม่บันทึก
    }
  }, [key, value])

  return [value, setValue]
}
