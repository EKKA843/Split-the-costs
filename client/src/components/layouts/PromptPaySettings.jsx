import { QrCodeIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SectionIcon from "@/components/layouts/SectionIcon"
import { TONES } from "@/constants/tones"
import { isValidPromptPayId, normalizePromptPayId } from "@/lib/promptpay"

function PromptPaySettings({ promptPay, onChange, className }) {
  const digits = normalizePromptPayId(promptPay.id)
  const invalid = digits.length > 0 && !isValidPromptPayId(digits)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SectionIcon icon={QrCodeIcon} tone={TONES.blue} />
          รับเงินผ่านพร้อมเพย์
        </CardTitle>
        <CardDescription>ใส่ของคนที่จ่ายบิลไปก่อน เพื่อสร้าง QR ให้เพื่อนสแกนจ่าย</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="promptpay-id">เบอร์โทร / เลขบัตรประชาชน</Label>
          <Input
            id="promptpay-id"
            inputMode="numeric"
            autoComplete="off"
            value={promptPay.id}
            onChange={(e) => onChange({ ...promptPay, id: e.target.value })}
            placeholder="08x-xxx-xxxx"
            aria-invalid={invalid ? true : undefined}
            className="h-9"
          />
          {invalid && (
            <p className="text-xs text-destructive">
              ต้องเป็นเบอร์มือถือ 10 หลัก หรือเลขบัตรประชาชน 13 หลัก
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="promptpay-name">ชื่อผู้รับ (ไม่บังคับ)</Label>
          <Input
            id="promptpay-name"
            value={promptPay.name}
            onChange={(e) => onChange({ ...promptPay, name: e.target.value })}
            placeholder="เช่น ต้น"
            className="h-9"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default PromptPaySettings
