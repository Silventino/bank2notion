const { Client } = require("@notionhq/client");
require("dotenv").config();
const fs = require("fs");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const insertExpense = async (expense) => {
  return notion.pages.create({
    parent: {
      database_id: process.env.NOTION_BANK_DATABASE_ID,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: expense.name,
            },
          },
        ],
      },
      Value: {
        number: parseFloat(expense.value),
      },
      Tags: {
        multi_select: [
          {
            name: "itaú",
          },
        ],
      },
      Date: {
        date: {
          start: expense.date,
        },
      },
    },
  });
};

const readPdf = async (path) => {
  return new Promise(async (resolve, reject) => {
    const pdfreader = await import("pdfreader");
    const pdfReader = new pdfreader.PdfReader();
    const items = [];
    pdfReader.parseFileItems(path, (err, item) => {
      if (err) {
        reject(err);
      } else if (!item) {
        resolve(items);
      } else if (item.text) {
        items.push(item.text);
      }
    });
  });
};

const dateIsAfter = (date1, date2) => {
  if (!date1 || !date2) return false;
  if (date1 === date2) return false;

  const date1Parts = date1.split("-");
  const date2Parts = date2.split("-");
  const date1Obj = new Date(date1Parts[0], date1Parts[1] - 1, date1Parts[2]);
  const date2Obj = new Date(date2Parts[0], date2Parts[1] - 1, date2Parts[2]);
  return date1Obj < date2Obj;
};

const parsePdf = (items) => {
  if (!fs.existsSync("./lastInsertedDate.txt")) {
    fs.writeFileSync("./lastInsertedDate.txt", "");
  }

  const lastInsertedDate = fs.readFileSync("./lastInsertedDate.txt", "utf8");

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
            value: items[i + 2].replace(".", "").replace(",", "."),
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

const main = async () => {
  const args = process.argv.slice(2);
  const pdfPath = args[0];
  const items = await readPdf(pdfPath);
  const expenses = parsePdf(items);

  let lastInsertedDate = "";
  for (const expense of expenses) {
    await insertExpense(expense);
    lastInsertedDate = expense.date;
  }

  if (lastInsertedDate) {
    fs.writeFileSync("./lastInsertedDate.txt", lastInsertedDate);
  }
};

main();
