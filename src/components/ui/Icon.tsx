import React, {useId} from 'react'
import {motion, MotionProps} from 'framer-motion'
import {ICONS} from "../../constants/icons.ts"

type IconProps = {
  size?: number
  icon: keyof typeof ICONS
  className?: string
  motionProps?: MotionProps,
  gradient?: {
    from: string
    to: string
    direction?: 'horizontal' | 'vertical' | 'diagonal'
  }
}

export default function Icon({
                               size = 26,
                               icon,
                               className = '',
                               motionProps,
                               gradient
                             }: IconProps): React.JSX.Element {
  const pathData = ICONS[icon]

  const gradientId = useId()

  const gradientCoords = {
    horizontal: {x1: "0%", y1: "0%", x2: "100%", y2: "0%"},
    vertical: {x1: "0%", y1: "0%", x2: "0%", y2: "100%"},
    diagonal: {x1: "0%", y1: "0%", x2: "100%", y2: "100%"},
  }
  const coords = gradientCoords[gradient?.direction || 'diagonal']

  const fillValue = gradient ? `url(#${gradientId})` : "currentColor"

  const GradientDefs = gradient && (
    <defs>
      <linearGradient id={gradientId} {...coords}>
        <stop offset="0%" stopColor={gradient.from}/>
        <stop offset="100%" stopColor={gradient.to}/>
      </linearGradient>
    </defs>
  )

  if (motionProps) {
    return (
      <motion.svg
        {...motionProps}
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
      >
        {GradientDefs}
        <motion.path d={pathData} fill={fillValue}/>
      </motion.svg>
    )
  }

  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      {GradientDefs}
      <path d={pathData} fill={fillValue}/>
    </svg>
  )
}
