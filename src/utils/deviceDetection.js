export function getNativeDeviceMode() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'desktop';
  }

  const isIPadOS =
    /Macintosh/i.test(navigator.userAgent || '') &&
    Number(navigator.maxTouchPoints || 0) > 1;

  if (isIPadOS) {
    return 'mobile';
  }

  if (
    navigator.userAgentData &&
    typeof navigator.userAgentData.mobile === 'boolean'
  ) {
    return navigator.userAgentData.mobile ? 'mobile' : 'desktop';
  }

  const userAgent = navigator.userAgent || '';
  const isMobileUserAgent =
    /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile|Tablet/i.test(userAgent);

  return isMobileUserAgent ? 'mobile' : 'desktop';
}
