export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function isActiveRoute(path, to) {
  if (to === '/') return path === '/'
  return path.startsWith(to)
}
