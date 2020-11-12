export default function getTopic(dataType: string): string {
  return `reporting_${dataType.replace(' ', '_').toLowerCase()}`;
}
