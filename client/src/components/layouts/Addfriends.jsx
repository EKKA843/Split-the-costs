import { useState } from "react"
import { UserPlusIcon, UsersIcon, XIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import SectionIcon from "@/components/layouts/SectionIcon"
import { personTone, TONES } from "@/constants/tones"
import { cn } from "@/lib/utils"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function Addfriends({ people, onAdd, onRemove, className }) {
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  function addPerson() {
    const trimmed = name.trim()
    if (trimmed === "") return

    // กันชื่อซ้ำ (ไม่สนตัวพิมพ์เล็ก/ใหญ่)
    if (people.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      setError(`มี "${trimmed}" อยู่แล้ว`)
      return
    }

    onAdd(trimmed)
    setName("")
    setError("")
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SectionIcon icon={UsersIcon} tone={TONES.sky} />
          เพื่อนที่มาด้วย
        </CardTitle>
        <CardDescription>เพิ่มชื่อทุกคนที่จะหารบิล</CardDescription>
        <CardAction>
          <Badge variant="secondary">{people.length} คน</Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError("")
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addPerson()
              }
            }}
            placeholder="ชื่อเพื่อน"
            aria-invalid={error ? true : undefined}
            enterKeyHint="done"
            className="h-9"
          />
          <Button onClick={addPerson} size="lg">
            <UserPlusIcon data-icon="inline-start" />
            เพิ่ม
          </Button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}

        {people.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {people.map((person) => (
              <li key={person}>
                <Badge variant="outline" className="h-8 gap-1.5 pr-1 pl-1 text-sm">
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                      personTone(people, person).solid
                    )}
                  >
                    {person.slice(0, 1)}
                  </span>
                  {person}
                  <button
                    type="button"
                    onClick={() => onRemove(person)}
                    className="flex size-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label={`ลบ ${person}`}
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">ยังไม่มีเพื่อน ลองพิมพ์ชื่อแล้วกด Enter</p>
        )}
      </CardContent>
    </Card>
  )
}

export default Addfriends
