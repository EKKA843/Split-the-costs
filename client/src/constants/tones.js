// โทนสีที่ใช้ซ้ำทั้งแอป (ต้องเขียน class เต็ม ๆ ให้ Tailwind เห็น)
export const TONES = {
  orange: {
    soft: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
    solid: "bg-orange-500 text-white",
  },
  sky: {
    soft: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    solid: "bg-sky-500 text-white",
  },
  amber: {
    soft: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    solid: "bg-amber-500 text-white",
  },
  pink: {
    soft: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
    solid: "bg-pink-500 text-white",
  },
  violet: {
    soft: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    solid: "bg-violet-500 text-white",
  },
  blue: {
    soft: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    solid: "bg-blue-600 text-white",
  },
  emerald: {
    soft: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    solid: "bg-emerald-500 text-white",
  },
  teal: {
    soft: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
    solid: "bg-teal-500 text-white",
  },
  rose: {
    soft: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    solid: "bg-rose-500 text-white",
  },
  slate: {
    soft: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
    solid: "bg-slate-500 text-white",
  },
}

const PERSON_TONES = ["sky", "pink", "amber", "violet", "emerald", "orange", "teal", "rose", "blue"]

// สีประจำตัวของแต่ละคน ตามลำดับที่เพิ่มเข้ามา
export function personTone(people, name) {
  const index = Math.max(0, people.indexOf(name))
  return TONES[PERSON_TONES[index % PERSON_TONES.length]]
}
