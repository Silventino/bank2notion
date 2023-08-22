const { Client } = require("@notionhq/client");
require("dotenv").config();
const fs = require("fs");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const insertExpense = async (expense) => {
  let value = parseFloat(expense.value);

  return notion.pages.create({
    parent: {
      database_id: process.env.NOTION_CARD_DATABASE_ID,
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
        number: value,
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

const parsePdf = (items) => {
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

      const obj = {
        date: date,
        name: items[i + 1],
        value: items[i + 2].replace(".", "").replace(",", "."),
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

const main = async () => {
  const args = process.argv.slice(2);
  const pdfPath = args[0];
  const items = await readPdf(pdfPath);
  const expenses = parsePdf(items);

  for (const expense of expenses) {
    await insertExpense(expense);
  }
};

main();
