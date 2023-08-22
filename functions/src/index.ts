import functions from "firebase-functions";
import admin from "firebase-admin";
import express from "express";
import "firebase-functions/logger/compat";
import { filesUpload } from "./middleware.js";
import readPdf, { CustomFile } from "./readPdf.js";
import parseBankStatement from "./parseBankStatement.js";
import parseCardInvoice from "./parseCardInvoice.js";
import Expense from "./types/expenseType.js";
import insertExpense from "./insertExpenseNotion.js";
// const pdfreader = require("pdfreader");

const app = express();

// Initialize Firebase Admin SDK
admin.initializeApp();

// Define your function to receive the file
app.post("/", filesUpload, async (req, res) => {
  try {
    res.set("Access-Control-Allow-Origin", "*");
    const files = req.files as any as CustomFile[];
    const file = files[0];
    const ignoreEntriesBefore = req.body.ignore_entries_before;
    const fileType = req.body.file_type;
    const bank = req.body.bank;
    const notionToken = req.body.notion_token;
    const notionDatabaseId = req.body.notion_database_id;

    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const items = await readPdf(file);

    let expenses: Expense[] = [];
    if (fileType === "bank_statement") {
      expenses = parseBankStatement(bank, items, ignoreEntriesBefore);
    } else if (fileType === "card_invoice") {
      expenses = parseCardInvoice(bank, items, ignoreEntriesBefore);
    }

    if (expenses.length === 0) {
      throw new Error("No expenses found");
    }

    const { Client } = await import("@notionhq/client");

    const notion = new Client({
      auth: notionToken,
    });

    for (const expense of expenses.slice(0, 4)) {
      await insertExpense(notion, notionDatabaseId, expense);
    }

    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
});

// Set up the Cloud Function
export const uploadFile = functions.https.onRequest(app);
