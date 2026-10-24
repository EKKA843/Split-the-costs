import { cn } from "@/lib/utils"

// ไอคอนสีประจำแต่ละหัวข้อ
function SectionIcon({ icon: Icon, tone, className }) {
  return (
    <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg", tone.soft, className)}>
      <Icon className="size-4" />
    </span>
  )
}

export default SectionIcon
