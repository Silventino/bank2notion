import dateIsAfter from "./dateIsAfter.js";

const parseCardInvoiceItau = (items, lastInsertedDate) => {
  let tableEnded = false;
  const entries = [];
  for (let i = 0; i < items.length && !tableEnded; i++) {
    const item = items[i];
    if (item.includes("próximas faturas")) {
      tableEnded = true;
      continue;
    }

    if (item.match(/^[0-9]{2}\/[0-9]{2}$/)) {
      const dateParts = item.split("/");
      const year = new Date().getFullYear();
      const date = `${year}-${dateParts[1]}-${dateParts[0]}`;

      if (lastInsertedDate && !dateIsAfter(lastInsertedDate, date)) {
        continue;
      }

      const obj = {
        date: date,
        name: items[i + 1],
        value: parseFloat(items[i + 2].replace(".", "").replace(",", ".")),
      };
      entries.push(obj);
      i += 2;
    }
  }
  return entries;
};

const parseCardInvoiceNubank = (items, lastInsertedDate) => {
  let tableEnded = false;
  let tableBegan = false;
  const entries = [];
  for (let i = 0; i < items.length && !tableEnded; i++) {
    const item = items[i];
    if (tableBegan && item === "FATURA") {
      tableEnded = true;
      continue;
    }
    if (item.includes("TRANSAÇÕES")) {
      tableBegan = true;
      continue;
    }

    const monthTranslator = {
      JAN: "01",
      FEV: "02",
      MAR: "03",
      ABR: "04",
      MAI: "05",
      JUN: "06",
      JUL: "07",
      AGO: "08",
      SET: "09",
      OUT: "10",
      NOV: "11",
      DEZ: "12",
    };

    if (
      tableBegan &&
      item.match(/^[0-9]{2} [A-Z]{3}$/) &&
      items[i + 1] &&
      items[i + 2]
    ) {
      if (items[i + 1].startsWith("Pagamento em ")) {
        continue;
      }

      const dateParts = item.split(" ");
      const year = new Date().getFullYear();
      const month = monthTranslator[dateParts[1]];

      const date = `${year}-${month}-${dateParts[0]}`;

      if (lastInsertedDate && !dateIsAfter(lastInsertedDate, date)) {
        continue;
      }

      let value;

      if (items[i + 2].startsWith("USD")) {
        value = parseFloat(items[i + 4].replace(".", "").replace(",", "."));
      } else {
        value = parseFloat(items[i + 2].replace(".", "").replace(",", "."));
      }

      const obj = {
        date: date,
        name: items[i + 1],
        value: value,
      };
      entries.push(obj);
      i += 2;
    }
  }
  return entries;
};

const parseCardInvoice = (bank, items, lastInsertedDate) => {
  let entries = [];
  switch (bank) {
    case "itaú":
      entries = parseCardInvoiceItau(items, lastInsertedDate);
      break;
    case "nubank":
      entries = parseCardInvoiceNubank(items, lastInsertedDate);
      break;
    default:
      throw new Error("Bank not supported.");
  }

  entries.sort((a, b) => {
    return a.date > b.date ? 1 : -1;
  });

  return entries;
};

export default parseCardInvoice;
