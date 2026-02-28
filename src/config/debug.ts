export function applyDebugBorders() {
  const html = document.documentElement
  const debugBorders = import.meta.env.VITE_DEBUG_BORDERS === "true"

  if (debugBorders) {
    html.classList.add("debug-borders")
  } else {
    html.classList.remove("debug-borders")
  }
}
