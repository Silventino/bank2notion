import dateIsAfter from "./dateIsAfter.js";

const parseBankStatement = (bank, items, lastInsertedDate) => {
  if (bank !== "itaú") {
    throw new Error("Bank not supported.");
  }

  console.log("Parsing PDF...");
  let tableBegan = false;
  let tableEnded = false;
  const entries = [];
  for (let i = 0; i < items.length && !tableEnded; i++) {
    const item = items[i];
    if (item === "saldo (R$)") {
      tableBegan = true;
      continue;
    }
    if (item === "Aviso!") {
      console.log("Table ended.");
      tableEnded = true;
      continue;
    }
    if (tableBegan && !tableEnded) {
      if (item.match(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/)) {
        if (items[i + 1] !== "SALDO DO DIA") {
          const dateParts = item.split("/");
          const date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
          if (lastInsertedDate && !dateIsAfter(lastInsertedDate, date)) {
            continue;
          }

          const obj = {
            date: date,
            name: items[i + 1],
            value: parseFloat(items[i + 2].replace(".", "").replace(",", ".")),
          };
          entries.push(obj);
        }
        i += 2;
      } else {
        continue;
      }
    }
  }

  entries.sort((a, b) => {
    return a.date > b.date ? 1 : -1;
  });

  return entries;
};

export default parseBankStatement;
