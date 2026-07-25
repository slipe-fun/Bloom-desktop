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
    }
} as const;