declare module "jspdf" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsPDF: any;
  export default jsPDF;
}
declare module "jspdf-autotable" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autoTable: any;
  export default autoTable;
}
declare module "xlsx" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const utils: any;
  export function writeFile(wb: any, filename: string): void;
}
