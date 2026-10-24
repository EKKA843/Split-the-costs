import { QRCodeSVG } from "qrcode.react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatBaht } from "@/lib/calc"
import { formatPromptPayId, promptPayPayload } from "@/lib/promptpay"

function PaymentQrDialog({ person, promptPay, onClose }) {
  return (
    <Dialog open={person !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        {person && (
          <>
            <DialogHeader>
              <DialogTitle>QR พร้อมเพย์ของ {person.name}</DialogTitle>
              <DialogDescription>สแกนด้วยแอปธนาคารเพื่อจ่ายยอดนี้</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center gap-3 py-2">
              {/* QR ต้องมีพื้นขาวเสมอเพื่อให้สแกนได้ แม้อยู่ใน dark mode */}
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <QRCodeSVG
                  value={promptPayPayload(promptPay.id, person.pay)}
                  size={220}
                  level="M"
                  marginSize={0}
                />
              </div>
              <p className="font-heading text-3xl font-semibold tabular-nums">
                {formatBaht(person.pay, { decimals: 0 })} ฿
              </p>
              <p className="text-center text-sm text-muted-foreground">
                โอนให้ {promptPay.name.trim() || "ผู้รับ"} · {formatPromptPayId(promptPay.id)}
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PaymentQrDialog
