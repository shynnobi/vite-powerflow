/**
 * Browser detection and font size adjustment utilities
 */

/**
 * Detects if the current browser is Safari
 */
export function isSafari(): boolean {
  if (typeof window === 'undefined') return false;
  return /Safari/.test(window.navigator.userAgent) && !/Chrome/.test(window.navigator.userAgent);
}

/**
 * Detects if the current browser is Chrome
 */
export function isChrome(): boolean {
  if (typeof window === 'undefined') return false;
  return /Chrome/.test(window.navigator.userAgent) && !/Edge/.test(window.navigator.userAgent);
}

/**
 * Detects if the current browser is Firefox
 */
export function isFirefox(): boolean {
  if (typeof window === 'undefined') return false;
  return /Firefox/.test(window.navigator.userAgent);
}

/**
 * Calculates Safari font size based on current HTML font size
 * @param offset - Pixel offset to apply (default: -2)
 * @returns Calculated font size for Safari
 */
export function getSafariFontSize(offset: number = -2): number {
  if (typeof window === 'undefined') return 16; // Fallback

  const htmlElement = document.documentElement;
  const computedStyle = window.getComputedStyle(htmlElement);
  const htmlFontSize = parseInt(computedStyle.fontSize);

  return htmlFontSize + offset;
}

/**
 * Applies Safari font size adjustment
 * @param offset - Pixel offset to apply (default: -2)
 * @returns Object with original and adjusted sizes
 */
export function applySafariFontAdjustment(offset: number = -2) {
  if (!isSafari()) return null;

  const originalSize = parseInt(window.getComputedStyle(document.documentElement).fontSize);
  const safariSize = getSafariFontSize(offset);

  document.documentElement.style.fontSize = safariSize + 'px';

  return {
    original: originalSize,
    adjusted: safariSize,
    offset,
  };
}
