import { formatBaht, SERVICE_PERCENT, VAT_PERCENT } from "@/lib/calc"
import { formatPromptPayId, isValidPromptPayId } from "@/lib/promptpay"
import { getCategory } from "@/constants/categories"

const LINE = "━━━━━━━━━━━━━━"

// สร้างข้อความสรุปบิลสำหรับวางในแชต (เช่น LINE)
export function buildShareText({ result, items, settings, promptPay }) {
  const date = new Date().toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const lines = [`🧾 สรุปบิล (${date})`, LINE, "🍽️ รายการ"]

  for (const item of items) {
    const split = item.sharedBy.length > 1 ? ` ÷${item.sharedBy.length}` : ""
    lines.push(`${getCategory(item.category).emoji} ${item.title} ${formatBaht(item.price)} ฿${split}`)
  }

  lines.push(LINE, `ค่าอาหาร: ${formatBaht(result.subtotal)} ฿`)
  if (settings.serviceCharge)
    lines.push(`Service ${SERVICE_PERCENT}%: ${formatBaht(result.service)} ฿`)
  if (settings.vat) lines.push(`VAT ${VAT_PERCENT}%: ${formatBaht(result.vat)} ฿`)
  lines.push(`💰 รวมทั้งบิล: ${formatBaht(result.total)} ฿`, LINE, "👥 ใครต้องจ่ายเท่าไหร่")

  for (const p of result.perPerson) {
    if (p.pay === 0) continue
    lines.push(`👤 ${p.name}: ${formatBaht(p.pay, { decimals: 0 })} ฿`)
    for (const it of p.items) {
      const split = it.splitCount > 1 ? ` (÷${it.splitCount})` : ""
      lines.push(`   - ${it.title}${split} ${formatBaht(it.share)}`)
    }
  }

  if (isValidPromptPayId(promptPay.id)) {
    const name = promptPay.name.trim() ? ` (${promptPay.name.trim()})` : ""
    lines.push(LINE, `💳 โอนพร้อมเพย์: ${formatPromptPayId(promptPay.id)}${name}`)
  }

  return lines.join("\n")
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // สำรองสำหรับเบราว์เซอร์ที่ไม่รองรับ clipboard API (เช่น http บนมือถือ)
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand("copy")
    textarea.remove()
    return ok
  }
}
