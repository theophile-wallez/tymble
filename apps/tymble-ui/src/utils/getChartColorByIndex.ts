export const getChartColorByIndex = (index: number, modulus = 5) =>
  `var(--chart-${(index % modulus) + 1})`;
