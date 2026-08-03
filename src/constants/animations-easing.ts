export const EASING = {
  springy: {
    type: "spring",
    stiffness: 400,
    damping: 17,
  },
  springyTimed: {
    type: "spring",
    bounce: 0.35,
    duration: 0.5,
  },
  quickSpring: {
    type: "spring",
    bounce: 0,
    duration: 0.2,
  },
  middleSpring: {
    type: "spring",
    bounce: 0,
    duration: 0.275,
  },
  normalSpring: {
    type: "spring",
    bounce: 0,
    duration: 0.35,
  },
  slowSpring: {
    type: "spring",
    bounce: 0,
    duration: 0.6,
  },
} as const
