import { motion } from "framer-motion"
import { useMemo } from "react"
import { cn } from "@/lib/utils"

interface DashedBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  width: number
  height: number
  borderRadius?: number
  dashLength?: number
  gapLength?: number
  strokeWidth?: number
  color?: string
  duration?: number
  children?: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

export default function DashedBox({
  children,
  width,
  height,
  borderRadius = 26,
  dashLength = 15,
  gapLength = 15,
  strokeWidth = 4,
  color = "currentColor",
  duration = 1500,
  className,
  style,
  ref,
  ...props
}: DashedBoxProps) {
  const inset = strokeWidth / 2
  const rectWidth = Math.max(0, width - strokeWidth)
  const rectHeight = Math.max(0, height - strokeWidth)

  const r = Math.min(borderRadius, rectWidth / 2, rectHeight / 2)

  const { actualDash, actualGap, actualPattern } = useMemo(() => {
    const perimeter =
      2 * (rectWidth - 2 * r) + 2 * (rectHeight - 2 * r) + 2 * Math.PI * r

    const desiredPattern = dashLength + gapLength
    const dashCount = Math.max(1, Math.round(perimeter / desiredPattern))
    const pattern = perimeter / dashCount

    return {
      actualDash: pattern * (dashLength / desiredPattern),
      actualGap: pattern * (gapLength / desiredPattern),
      actualPattern: pattern,
    }
  }, [rectWidth, rectHeight, r, dashLength, gapLength])

  return (
    <div
      ref={ref}
      className={cn("relative flex items-center justify-center", className)}
      style={{ width, height, ...style }}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0">
        <svg width="100%" height="100%">
          <motion.rect
            x={inset}
            y={inset}
            width={rectWidth}
            height={rectHeight}
            rx={r}
            ry={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${actualDash} ${actualGap}`}
            strokeLinecap="round"
            animate={{
              strokeDashoffset: [0, -actualPattern],
            }}
            transition={{
              duration: duration / 1000,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        </svg>
      </div>

      {children}
    </div>
  )
}
