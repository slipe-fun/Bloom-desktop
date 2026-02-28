import React from 'react'
import {motion, MotionProps} from 'framer-motion'
import {ICONS} from "../../constants/icons.ts"

type IconProps = {
  size?: number
  icon: keyof typeof ICONS
  className?: string
  motionProps?: MotionProps
}

export default function Icon({
                               size = 26,
                               icon,
                               className = '',
                               motionProps
                             }: IconProps): React.JSX.Element {
  const pathData = ICONS[icon]

  if (motionProps) {
    return (
      <motion.svg
        {...motionProps}
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <motion.path d={pathData}/>
      </motion.svg>
    )
  }

  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path fill="currentColor" d={pathData}/>
    </svg>
  )
}
