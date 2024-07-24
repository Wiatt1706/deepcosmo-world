// ExportExcel.tsx
import { utils, writeFile } from "xlsx";

export const handleExport = (data: any, fileName: string) => {
  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet1");
  writeFile(workbook, `${fileName}.xlsx`);
};
