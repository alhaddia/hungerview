/** Color counties by HDPulse food insecurity percent. */
export function foodInsecurityColor(percent: number): string {
  if (percent >= 20) return '#7f1d1d';
  if (percent >= 16) return '#b91c1c';
  if (percent >= 13) return '#c2410c';
  if (percent >= 11) return '#ca8a04';
  if (percent >= 9) return '#65a30d';
  return '#166534';
}

export function foodInsecurityBand(percent: number): string {
  if (percent >= 20) return 'Very high';
  if (percent >= 16) return 'High';
  if (percent >= 13) return 'Elevated';
  if (percent >= 11) return 'Moderate';
  return 'Lower';
}
