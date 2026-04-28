/**
 * Extracts text content from uploaded files.
 * Supports: PDF, DOCX, XLSX/XLS/CSV, TXT
 */

export type SupportedFileType = "pdf" | "docx" | "xlsx" | "txt" | "unknown";

export function detectFileType(file: File): SupportedFileType {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const mime = file.type;

  if (ext === "pdf" || mime === "application/pdf") return "pdf";
  if (
    ext === "docx" ||
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "docx";
  if (
    ext === "doc" ||
    mime === "application/msword"
  )
    return "docx"; // treat .doc same path, mammoth handles both
  if (
    ["xlsx", "xls", "csv"].includes(ext) ||
    mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mime === "application/vnd.ms-excel" ||
    mime === "text/csv"
  )
    return "xlsx";
  if (
    ext === "txt" ||
    mime.startsWith("text/")
  )
    return "txt";

  return "unknown";
}

export async function extractTextFromFile(file: File): Promise<string> {
  const type = detectFileType(file);

  switch (type) {
    case "pdf":
      return extractPdf(file);
    case "docx":
      return extractDocx(file);
    case "xlsx":
      return extractExcel(file);
    case "txt":
      return extractPlainText(file);
    default:
      throw new Error(
        `Unsupported file format: .${file.name.split(".").pop()}. Please upload a PDF, Word, Excel, or text file.`
      );
  }
}

/* ─── PDF ────────────────────────────────────────────────────────────────────── */
async function extractPdf(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");

  // Use the CDN worker to avoid webpack issues in Next.js
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push(text);
  }

  return pages.join("\n\n").trim();
}

/* ─── DOCX / DOC ─────────────────────────────────────────────────────────────── */
async function extractDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

/* ─── Excel / CSV ────────────────────────────────────────────────────────────── */
async function extractExcel(file: File): Promise<string> {
  const XLSX = await import("xlsx");
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  const allText: string[] = [];
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    // Convert to array of arrays, then join all cells
    const rows: string[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
    });
    const sheetText = rows
      .map((row) => row.filter((c) => c !== "").join(" | "))
      .filter((line) => line.trim() !== "")
      .join("\n");
    if (sheetText) {
      allText.push(`[Sheet: ${sheetName}]\n${sheetText}`);
    }
  }

  return allText.join("\n\n").trim();
}

/* ─── Plain text ─────────────────────────────────────────────────────────────── */
async function extractPlainText(file: File): Promise<string> {
  return await file.text();
}

/* ─── Accepted file extensions for the input ─────────────────────────────────── */
export const ACCEPTED_EXTENSIONS =
  ".pdf,.doc,.docx,.xlsx,.xls,.csv,.txt,.rtf";
export const ACCEPTED_MIME_TYPES =
  "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,text/plain";

export const FILE_TYPE_LABELS: Record<SupportedFileType, string> = {
  pdf:     "PDF Document",
  docx:    "Word Document",
  xlsx:    "Excel Spreadsheet",
  txt:     "Text File",
  unknown: "Unknown",
};
