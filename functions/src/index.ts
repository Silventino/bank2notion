import functions from "firebase-functions";
import admin from "firebase-admin";
import express from "express";
import "firebase-functions/logger/compat";
import { parseRequest } from "./middleware.js";
import readPdf, { CustomFile } from "./readPdf.js";
import parseBankStatement from "./parseBankStatement.js";
import parseCardInvoice from "./parseCardInvoice.js";
import ParsedPdfEntry from "./types/Expense.js";
import insertIntoNotion from "./insertIntoNotion.js";
import NotionPropertiesMap from "./types/Headers.js";

const app = express();

admin.initializeApp();

app.post("/databaseProperties", parseRequest, async (req, res) => {
  try {
    res.set("Access-Control-Allow-Origin", "*");
    const notionToken = req.body.notion_token as string;
    const notionDatabaseId = req.body.notion_database_id as string;

    const { Client } = await import("@notionhq/client");

    const notion = new Client({
      auth: notionToken,
    });

    const response = await notion.databases.retrieve({
      database_id: notionDatabaseId,
    });

    const properties = response.properties;

    return res.status(200).json(properties);
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
});

app.post("/parsePdf", parseRequest, async (req, res) => {
  try {
    res.set("Access-Control-Allow-Origin", "*");
    const files = req.files as any as CustomFile[];
    const file = files[0];
    const ignoreEntriesBefore = req.body.ignore_entries_before as string;
    const fileType = req.body.file_type as string;
    const bank = req.body.bank as string;
    // const notionToken = req.body.notion_token;
    // const notionDatabaseId = req.body.notion_database_id;

    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const items = await readPdf(file);

    let expenses: ParsedPdfEntry[] = [];
    if (fileType === "bank_statement") {
      expenses = parseBankStatement(bank, items, ignoreEntriesBefore);
    } else if (fileType === "card_invoice") {
      expenses = parseCardInvoice(bank, items, ignoreEntriesBefore);
    }

    if (expenses.length === 0) {
      throw new Error("No expenses found");
    }

    // const { Client } = await import("@notionhq/client");

    // const notion = new Client({
    //   auth: notionToken,
    // });
    // console.log("notion", notion);

    // for (const expense of expenses) {
    //   console.log("expense", expense);
    //   // await insertExpense(notion, notionDatabaseId, expense);
    // }

    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
});

app.post("/insertIntoNotion", parseRequest, async (req, res) => {
  try {
    res.set("Access-Control-Allow-Origin", "*");
    const notionToken = req.body.notion_token as string;
    const notionDatabaseId = req.body.notion_database_id as string;
    const headers = JSON.parse(
      req.body.notion_properties_map
    ) as NotionPropertiesMap;
    const expenses = JSON.parse(req.body.parsed_pdf) as ParsedPdfEntry[];

    if (!expenses) {
      return res.status(400).send("No expenses provided.");
    }

    const { Client } = await import("@notionhq/client");

    const notion = new Client({
      auth: notionToken,
    });

    for (const expense of expenses) {
      console.log("expense", expense);
      await insertIntoNotion(notion, notionDatabaseId, headers, expense);
    }

    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
});

export const api = functions.https.onRequest(app);
