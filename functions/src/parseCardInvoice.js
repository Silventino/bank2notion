import dateIsAfter from "./dateIsAfter.js";

const parseCardInvoice = (bank, items, lastInsertedDate) => {
  if (bank !== "itaú") {
    throw new Error("Bank not supported.");
  }

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

  entries.sort((a, b) => {
    return a.date > b.date ? 1 : -1;
  });

  return entries;
};

export default parseCardInvoice;
