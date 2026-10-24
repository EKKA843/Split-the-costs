import { useState } from "react"
import { toast } from "sonner"
import { AlertTriangleIcon, ChevronDownIcon, CopyIcon, QrCodeIcon, SendIcon, WalletIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import PaymentQrDialog from "@/components/layouts/PaymentQrDialog"
import SectionIcon from "@/components/layouts/SectionIcon"
import { CATEGORIES } from "@/constants/categories"
import { personTone, TONES } from "@/constants/tones"
import { formatBaht, SERVICE_PERCENT, totalsByCategory, VAT_PERCENT } from "@/lib/calc"
import { isValidPromptPayId } from "@/lib/promptpay"
import { buildShareText, copyText } from "@/lib/share"
import { cn } from "@/lib/utils"

function Row({ label, value, className }) {
  return (
    <div className={cn("flex justify-between gap-4", className)}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

function PersonRow({ person, tone, onShowQr }) {
  const [open, setOpen] = useState(false)
  const hasExtra = person.service > 0 || person.vat > 0

  return (
    <li className="rounded-xl border bg-card">
      <div className="flex items-center gap-2 p-2.5">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
          aria-expanded={open}
        >
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
              tone.solid
            )}
          >
            {person.name.slice(0, 1)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1 font-medium">
              <span className="truncate">{person.name}</span>
              <ChevronDownIcon
                className={cn(
                  "size-3.5 shrink-0 text-muted-foreground transition-transform",
                  open && "rotate-180"
                )}
              />
            </span>
            <span className="block text-xs text-muted-foreground">
              {person.items.length === 0 ? "ไม่มีรายการ" : `${person.items.length} รายการ`}
            </span>
          </span>
          <span className="text-right">
            <span className="block font-heading text-lg font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
              {formatBaht(person.pay, { decimals: 0 })} ฿
            </span>
            {person.total !== person.pay && (
              <span className="block text-xs text-muted-foreground tabular-nums">
                จริง {formatBaht(person.total)}
              </span>
            )}
          </span>
        </button>
        <Button
          variant="outline"
          size="icon-lg"
          onClick={() => onShowQr(person)}
          disabled={person.pay === 0}
          aria-label={`QR พร้อมเพย์ของ ${person.name}`}
          className="text-blue-600 dark:text-blue-400"
        >
          <QrCodeIcon />
        </Button>
      </div>

      {open && person.items.length > 0 && (
        <div className="space-y-1 rounded-b-xl border-t bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
          {person.items.map((it) => (
            <Row
              key={it.id}
              label={it.splitCount > 1 ? `${it.title} (${formatBaht(it.price)} ÷ ${it.splitCount})` : it.title}
              value={formatBaht(it.share)}
            />
          ))}
          {hasExtra && (
            <>
              <Separator className="my-1.5" />
              <Row label="ค่าอาหาร" value={formatBaht(person.subtotal)} />
              {person.service > 0 && <Row label="Service charge" value={formatBaht(person.service)} />}
              {person.vat > 0 && <Row label="VAT" value={formatBaht(person.vat)} />}
            </>
          )}
          <Row label="รวม" value={formatBaht(person.total)} className="font-medium text-foreground" />
        </div>
      )}
    </li>
  )
}

function Summary({ result, items, settings, promptPay, className }) {
  const [qrPerson, setQrPerson] = useState(null)
  const canPay = isValidPromptPayId(promptPay.id)
  const people = result.perPerson.map((p) => p.name)

  const header = (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <SectionIcon icon={WalletIcon} tone={TONES.emerald} />
        สรุปยอด
      </CardTitle>
      <CardDescription>
        {items.length === 0
          ? "เพิ่มเพื่อนและรายการ แล้วยอดของแต่ละคนจะขึ้นที่นี่"
          : "กดชื่อเพื่อดูว่ามาจากรายการไหน · กด QR ให้เพื่อนสแกนจ่าย"}
      </CardDescription>
    </CardHeader>
  )

  if (items.length === 0) {
    return (
      <Card className={className}>
        {header}
        <CardContent className="flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center text-muted-foreground">
          <span className="text-4xl">🧾</span>
          <p className="text-sm">ยังไม่มีรายการ</p>
        </CardContent>
      </Card>
    )
  }

  const byCategory = totalsByCategory(items)
  const shareText = () => buildShareText({ result, items, settings, promptPay })

  async function handleCopy() {
    const ok = await copyText(shareText())
    if (ok) toast.success("คัดลอกสรุปแล้ว เอาไปวางใน LINE ได้เลย")
    else toast.error("คัดลอกไม่สำเร็จ")
  }

  function handleShareLine() {
    window.open(`https://line.me/R/share?text=${encodeURIComponent(shareText())}`, "_blank", "noopener")
  }

  function showQr(person) {
    if (!canPay) {
      toast.warning("ใส่เบอร์หรือเลขบัตรประชาชนพร้อมเพย์ของคนรับเงินก่อน")
      document.getElementById("promptpay-id")?.focus()
      return
    }
    setQrPerson(person)
  }

  return (
    <Card className={className}>
      {header}

      <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
        {/* ยอดรวมทั้งบิล */}
        <div className="rounded-xl bg-linear-to-br from-orange-500 via-rose-500 to-pink-500 p-3.5 text-white shadow-sm">
          <div className="flex items-end justify-between gap-2">
            <span className="text-sm text-white/85">รวมทั้งบิล</span>
            <span className="font-heading text-2xl font-semibold tabular-nums">
              {formatBaht(result.total)} ฿
            </span>
          </div>
          <div className="mt-2 space-y-0.5 border-t border-white/25 pt-2 text-xs text-white/85">
            <Row label="ค่าอาหาร" value={`${formatBaht(result.subtotal)} ฿`} />
            {settings.serviceCharge && (
              <Row label={`Service charge ${SERVICE_PERCENT}%`} value={`${formatBaht(result.service)} ฿`} />
            )}
            {settings.vat && <Row label={`VAT ${VAT_PERCENT}%`} value={`${formatBaht(result.vat)} ฿`} />}
          </div>
        </div>

        {/* ยอดแยกตามหมวด */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.filter((c) => byCategory[c.id]).map((c) => (
            <span
              key={c.id}
              className={cn("flex h-6 items-center gap-1 rounded-full px-2 text-xs font-medium", c.tone.soft)}
            >
              <c.icon className="size-3" />
              {c.label} {formatBaht(byCategory[c.id], { decimals: 0 })}
            </span>
          ))}
        </div>

        {result.unassigned.items.length > 0 && (
          <div className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
            <p>
              มี {result.unassigned.items.length} รายการที่ยังไม่มีคนหาร (
              {formatBaht(result.unassigned.total)} ฿) ยอดนี้ยังไม่ถูกนับในยอดของใคร
            </p>
          </div>
        )}

        {result.perPerson.length > 0 && (
          // จอคอม: เลื่อนดูรายชื่อในกรอบนี้แทนการเลื่อนทั้งหน้า
          <ul className="-mx-1 min-h-0 flex-1 space-y-2 overflow-y-auto px-1">
            {result.perPerson.map((person) => (
              <PersonRow
                key={person.name}
                person={person}
                tone={personTone(people, person.name)}
                onShowQr={showQr}
              />
            ))}
          </ul>
        )}

        {result.roundingExtra > 0 && (
          <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Badge variant="outline">ปัดเศษขึ้น</Badge>
            เก็บรวม {formatBaht(result.collected, { decimals: 0 })} ฿ เกินบิลจริง{" "}
            {formatBaht(result.roundingExtra)} ฿
          </p>
        )}
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="lg" onClick={handleCopy}>
          <CopyIcon data-icon="inline-start" />
          คัดลอกสรุป
        </Button>
        <Button size="lg" onClick={handleShareLine} className="bg-[#06C755] text-white hover:bg-[#06C755]/85">
          <SendIcon data-icon="inline-start" />
          ส่งใน LINE
        </Button>
      </CardFooter>

      <PaymentQrDialog person={qrPerson} promptPay={promptPay} onClose={() => setQrPerson(null)} />
    </Card>
  )
}

export default Summary
