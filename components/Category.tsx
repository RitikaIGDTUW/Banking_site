import Image from "next/image"
import { cn } from "@/lib/utils"
import { Progress } from "./ui/progress"

/* 🎨 Color palette (auto-assigned per category) */
const CATEGORY_COLOR_PALETTE = [
  {
    bg: "bg-blue-50",
    circleBg: "bg-blue-100",
    textMain: "text-blue-900",
    textCount: "text-blue-600",
    progressBg: "bg-blue-100",
    progressIndicator: "bg-blue-600",
    icon: "/icons/tv-solid-full.svg",
  },
  {
    bg: "bg-green-50",
    circleBg: "bg-green-100",
    textMain: "text-green-900",
    textCount: "text-green-600",
    progressBg: "bg-green-100",
    progressIndicator: "bg-green-600",
    icon: "/icons/truck-regular-full.svg",
  },
  {
    bg: "bg-purple-50",
    circleBg: "bg-purple-100",
    textMain: "text-purple-900",
    textCount: "text-purple-600",
    progressBg: "bg-purple-100",
    progressIndicator: "bg-purple-600",
    icon: "/icons/shopping-bag.svg",
  },
  {
    bg: "bg-orange-50",
    circleBg: "bg-orange-100",
    textMain: "text-orange-900",
    textCount: "text-orange-600",
    progressBg: "bg-orange-100",
    progressIndicator: "bg-orange-600",
    icon: "/icons/burger-solid-full.svg",
  },
  {
    bg: "bg-yellow-50",
    circleBg: "bg-yellow-100",
    textMain: "text-yellow-900",
    textCount: "text-yellow-600",
    progressBg: "bg-yellow-100",
    progressIndicator: "bg-yellow-600",
    icon: "/icons/entertainment.svg",
  },
]

/* 🔁 Deterministic hash → color */
const getCategoryStyle = (name: string) => {
  const index =
    name
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    CATEGORY_COLOR_PALETTE.length

  return CATEGORY_COLOR_PALETTE[index]
}

const formatCategoryName = (name: string) =>
  name
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())

const Category = ({ category }: CategoryProps) => {
  const style = getCategoryStyle(category.name)

  return (
    <div
      className={cn(
        "flex gap-4 rounded-xl p-3 transition-all",
        style.bg
      )}
    >
      {/* Icon */}
      <figure
        className={cn(
          "flex-center size-10 rounded-full",
          style.circleBg
        )}
      >
        <Image
          src={style.icon}
          width={20}
          height={20}
          alt={category.name}
        />
      </figure>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2" style={{padding:'0.75rem'}}>
        <div className="flex justify-between text-14">
          <h2 className={cn("font-medium", style.textMain)}>
            {formatCategoryName(category.name)}
          </h2>
          <h3 className={cn("font-normal", style.textCount)}>
            {category.count}
          </h3>
        </div>

        <Progress
          value={(category.count / category.totalCount) * 100}
          className={cn("h-2", style.progressBg)}
          indicatorClassName={cn(
            "h-2",
            style.progressIndicator
          )}
        />
      </div>
    </div>
  )
}

export default Category
