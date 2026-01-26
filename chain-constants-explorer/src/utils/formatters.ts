export const formatValue = (value: any): string => {
  if (value == null) return 'N/A';
  if (typeof value === 'number') return value.toLocaleString();
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return value.toString();
};