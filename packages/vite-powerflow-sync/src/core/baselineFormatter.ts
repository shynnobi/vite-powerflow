/**
 * Formats a baseline (commit SHA or tag) for display in logs
 */
export function formatBaseline(baseline: string): string {
  // If baseline looks like a commit SHA, truncate it; otherwise, display as-is (tag)
  return /^[a-f0-9]{7,40}$/i.test(baseline) ? baseline.substring(0, 7) : baseline;
}
