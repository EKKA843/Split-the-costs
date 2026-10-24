import { PercentIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import SectionIcon from "@/components/layouts/SectionIcon"
import { TONES } from "@/constants/tones"
import { SERVICE_PERCENT, VAT_PERCENT } from "@/lib/calc"

function BillSettings({ settings, onChange, className }) {
  const options = [
    {
      key: "serviceCharge",
      title: `ค่าบริการ (Service charge) ${SERVICE_PERCENT}%`,
      hint: "คิดจากราคาอาหาร",
    },
    {
      key: "vat",
      title: `ภาษีมูลค่าเพิ่ม (VAT) ${VAT_PERCENT}%`,
      hint: "คิดหลังบวกค่าบริการแล้ว แบบร้านอาหารทั่วไป",
    },
  ]

  return (
    <Card size="sm" className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SectionIcon icon={PercentIcon} tone={TONES.violet} />
          ค่าบริการและภาษี
        </CardTitle>
        <CardDescription>เปิดตามที่ร้านเก็บจริง</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {options.map((opt) => (
          <Label
            key={opt.key}
            className="flex cursor-pointer items-center justify-between gap-4 rounded-lg px-2.5 py-2 font-normal transition-colors has-data-checked:bg-violet-500/10"
          >
            <span className="space-y-1">
              <span className="block font-medium">{opt.title}</span>
              <span className="block text-xs text-muted-foreground">{opt.hint}</span>
            </span>
            <Switch
              checked={settings[opt.key]}
              onCheckedChange={(checked) => onChange({ ...settings, [opt.key]: checked })}
            />
          </Label>
        ))}
      </CardContent>
    </Card>
  )
}

export default BillSettings
