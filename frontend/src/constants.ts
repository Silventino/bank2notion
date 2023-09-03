export const SERVER_URL =
  "https://us-central1-bank2notion.cloudfunctions.net/api";
// export const SERVER_URL = "http://127.0.0.1:5001/bank2notion/us-central1/api";

export const SUPPORTED_BANKS = [
  {
    name: "Itaú",
    value: "itaú",
    supportedFiles: [
      { name: "Card Invoice", value: "card_invoice" },
      { name: "Bank Statement", value: "bank_statement" },
    ],
  },
  {
    name: "Nubank",
    value: "nubank",
    supportedFiles: [{ name: "Card Invoice", value: "card_invoice" }],
  },
];

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
