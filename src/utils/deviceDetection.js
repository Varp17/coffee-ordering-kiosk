export function getNativeDeviceMode() {
  if (typeof window === 'undefined') {
    return 'desktop';
  }
  // Viewport width < 768px is mobile; >= 768px covers tablets and desktop
  return window.innerWidth < 768 ? 'mobile' : 'desktop';
}
