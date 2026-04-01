/** Format number with thousands separator */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("ja-JP").format(n);
}

/** Format percentage with 1 decimal */
export function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`;
}

/** Format decimal days */
export function formatDays(n: number | null | undefined): string {
  if (n == null) return "-";
  return `${n.toFixed(1)}日`;
}
