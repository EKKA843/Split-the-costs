import generatePayload from "promptpay-qr"

export function normalizePromptPayId(id) {
  return String(id ?? "").replace(/\D/g, "")
}

// เบอร์มือถือ 10 หลัก (ขึ้นต้นด้วย 0), เลขบัตรประชาชน/เลขผู้เสียภาษี 13 หลัก, e-Wallet 15 หลัก
export function isValidPromptPayId(id) {
  const digits = normalizePromptPayId(id)
  return /^0\d{9}$/.test(digits) || /^\d{13}$/.test(digits) || /^\d{15}$/.test(digits)
}

export function formatPromptPayId(id) {
  const d = normalizePromptPayId(id)
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
  if (d.length === 13)
    return `${d[0]}-${d.slice(1, 5)}-${d.slice(5, 10)}-${d.slice(10, 12)}-${d[12]}`
  return d
}

export function promptPayPayload(id, amount) {
  return generatePayload(normalizePromptPayId(id), { amount })
}
