import { CopyIcon, HeartIcon, WalletIcon } from "lucide-react"
import { toast } from "sonner"
import { copyText } from "@/lib/share"
import { cn } from "@/lib/utils"

const CREATOR = "ekkawat"
const TRUEMONEY_NUMBER = "0985796003"
const TRUEMONEY_DISPLAY = "098-579-6003"

function Footer({ className }) {
  async function copyNumber() {
    const ok = await copyText(TRUEMONEY_NUMBER)
    if (ok) toast.success("คัดลอกเบอร์ TrueMoney แล้ว ขอบคุณที่สนับสนุนครับ 🙏")
    else toast.error("คัดลอกไม่สำเร็จ")
  }

  return (
    <footer
      className={cn("flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-muted-foreground", className)}
    >
      <span className="flex items-center gap-1">
        สร้างด้วย
        <HeartIcon className="size-3.5 fill-rose-500 text-rose-500" />
        โดย <span className="font-semibold text-foreground">{CREATOR}</span>
      </span>
      <span className="hidden text-border sm:inline">|</span>
      <span className="flex flex-wrap items-center justify-center gap-1.5">
        ถ้าชอบ สนับสนุนได้ที่
        <button
          type="button"
          onClick={copyNumber}
          className="flex h-7 items-center gap-1.5 rounded-full bg-orange-100 px-2.5 font-medium text-orange-700 transition-colors hover:bg-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:hover:bg-orange-500/25"
          aria-label={`คัดลอกเบอร์ TrueMoney Wallet ${TRUEMONEY_DISPLAY}`}
        >
          <WalletIcon className="size-3.5" />
          TrueMoney Wallet
          <span className="tabular-nums">{TRUEMONEY_DISPLAY}</span>
          <CopyIcon className="size-3 opacity-70" />
        </button>
      </span>
    </footer>
  )
}

export default Footer
