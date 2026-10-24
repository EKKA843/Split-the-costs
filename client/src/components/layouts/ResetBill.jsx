import { useState } from "react"
import { RotateCcwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function ResetBill({ onReset, disabled }) {
  const [open, setOpen] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={<Button variant="outline" size="lg" disabled={disabled} aria-label="เริ่มบิลใหม่" />}
      >
        <RotateCcwIcon data-icon="inline-start" />
        <span className="hidden sm:inline">เริ่มบิลใหม่</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>เริ่มบิลใหม่?</AlertDialogTitle>
          <AlertDialogDescription>
            รายชื่อเพื่อนและรายการทั้งหมดจะถูกลบ และกู้คืนไม่ได้ (เลขพร้อมเพย์ยังจำไว้ให้)
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              onReset()
              setOpen(false)
            }}
          >
            ล้างบิล
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ResetBill
