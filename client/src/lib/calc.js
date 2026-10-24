// logic การคำนวณบิลทั้งหมด (ไม่มี UI ในไฟล์นี้)
// คิดเป็น "สตางค์" (จำนวนเต็ม) ตลอด เพื่อเลี่ยงปัญหาทศนิยมของ JavaScript

export const SERVICE_PERCENT = 10
export const VAT_PERCENT = 7
export const SERVICE_RATE = SERVICE_PERCENT / 100
export const VAT_RATE = VAT_PERCENT / 100

const toSatang = (baht) => Math.round(Number(baht) * 100)
const toBaht = (satang) => satang / 100

// แบ่ง total (สตางค์) ตามสัดส่วน weights ด้วยวิธี largest remainder
// ผลรวมที่ได้จะเท่ากับ total พอดีเสมอ
export function allocate(total, weights) {
  const sum = weights.reduce((s, w) => s + w, 0)
  if (sum <= 0 || total === 0) return weights.map(() => 0)

  const raw = weights.map((w) => (w * total) / sum)
  const result = raw.map(Math.floor)
  let remainder = total - result.reduce((s, n) => s + n, 0)

  const order = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac)

  for (let k = 0; remainder > 0; k = (k + 1) % order.length) {
    result[order[k].i] += 1
    remainder -= 1
  }
  return result
}

// ค่าเซอร์วิสชาร์จและ VAT แบบร้านอาหารไทย: VAT คิดหลังบวกเซอร์วิสชาร์จแล้ว
export function billTotals(subtotal, { serviceCharge, vat }) {
  const service = serviceCharge ? Math.round(subtotal * SERVICE_RATE) : 0
  const vatAmount = vat ? Math.round((subtotal + service) * VAT_RATE) : 0
  return { subtotal, service, vat: vatAmount, total: subtotal + service + vatAmount }
}

/**
 * คำนวณบิล
 * @param {string[]} people
 * @param {{id: string, title: string, price: number, sharedBy: string[]}[]} items
 * @param {{serviceCharge: boolean, vat: boolean}} settings
 */
export function calculateBill(people, items, settings) {
  const subtotal = items.reduce((s, item) => s + toSatang(item.price), 0)
  const bill = billTotals(subtotal, settings)

  const persons = people.map((name) => ({ name, base: 0, items: [] }))
  const unassignedItems = []
  let unassignedBase = 0

  for (const item of items) {
    const price = toSatang(item.price)
    const sharers = item.sharedBy.filter((name) => people.includes(name))
    if (sharers.length === 0) {
      unassignedBase += price
      unassignedItems.push(item)
      continue
    }
    const share = price / sharers.length
    for (const p of persons) {
      if (!sharers.includes(p.name)) continue
      p.base += share
      p.items.push({
        id: item.id,
        title: item.title,
        price: toBaht(price),
        splitCount: sharers.length,
        share: toBaht(share),
      })
    }
  }

  // แบ่งแต่ละส่วนของบิลแยกกัน เพื่อให้ผลรวมของทุกคนตรงกับบิลทุกบรรทัด
  const weights = [...persons.map((p) => p.base), unassignedBase]
  const subtotalParts = allocate(bill.subtotal, weights)
  const serviceParts = allocate(bill.service, weights)
  const vatParts = allocate(bill.vat, weights)

  const perPerson = persons.map((p, i) => {
    const total = subtotalParts[i] + serviceParts[i] + vatParts[i]
    return {
      name: p.name,
      items: p.items,
      subtotal: toBaht(subtotalParts[i]),
      service: toBaht(serviceParts[i]),
      vat: toBaht(vatParts[i]),
      total: toBaht(total),
      // ยอดที่ต้องจ่ายจริง ปัดขึ้นเป็นบาทเต็ม
      pay: Math.ceil(total / 100),
    }
  })

  const last = weights.length - 1
  const unassignedTotal = subtotalParts[last] + serviceParts[last] + vatParts[last]
  const collected = perPerson.reduce((s, p) => s + p.pay, 0)

  return {
    subtotal: toBaht(bill.subtotal),
    service: toBaht(bill.service),
    vat: toBaht(bill.vat),
    total: toBaht(bill.total),
    perPerson,
    unassigned: { items: unassignedItems, total: toBaht(unassignedTotal) },
    collected,
    // เงินที่เก็บเกินจากการปัดขึ้น
    roundingExtra: toBaht(collected * 100 - (bill.total - unassignedTotal)),
  }
}

// ยอดรวมแยกตามหมวดหมู่ (ก่อนเซอร์วิส/VAT) เช่น { food: 597, drink: 80 }
export function totalsByCategory(items, fallback = "other") {
  const satang = {}
  for (const item of items) {
    const key = item.category ?? fallback
    satang[key] = (satang[key] ?? 0) + toSatang(item.price)
  }
  return Object.fromEntries(Object.entries(satang).map(([k, v]) => [k, toBaht(v)]))
}

export function formatBaht(amount, { decimals = 2 } = {}) {
  return Number(amount).toLocaleString("th-TH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
