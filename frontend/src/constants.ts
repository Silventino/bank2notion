export const SERVER_URL =
  "https://us-central1-bank2notion.cloudfunctions.net/api";
// export const SERVER_URL = "http://127.0.0.1:5001/bank2notion/us-central1/api";

export type NotionProperties = {
  [k: string]: NotionProperty;
};

export type NotionProperty = {
  name: string;
  type: string;
};

export type ParsedPdfItem = {
  name: string;
  date: string;
  value: number;
};

export type ParsedPdf = ParsedPdfItem[];
