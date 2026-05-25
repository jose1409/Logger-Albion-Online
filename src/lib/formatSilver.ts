export const formatSilver = (amount: number): string =>
  new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(Math.round(amount));
