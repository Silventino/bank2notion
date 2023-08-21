import functions from "firebase-functions";
import admin from "firebase-admin";
import express from "express";
import "firebase-functions/logger/compat";
import { filesUpload } from "./middleware.js";
// const pdfreader = require("pdfreader");

type CustomFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

const app = express();

// Initialize Firebase Admin SDK
admin.initializeApp();

// Define your function to receive the file
app.post("/upload", filesUpload, async (req, res) => {
  const readPdf = async (file: CustomFile) => {
    return new Promise(async (resolve, reject) => {
      const pdfreader = await import("pdfreader");
      const pdfReader = new pdfreader.PdfReader(null);
      const items: string[] = [];
      pdfReader.parseBuffer(file.buffer, (err: any, item: any) => {
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

  try {
    res.set("Access-Control-Allow-Origin", "*");
    const files = req.files as any as CustomFile[];
    const file = files[0];

    console.log("File received:", file);
    console.log("body received:", req.body);
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const items = await readPdf(file);

    return res.status(200).json(items);
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).send("Error uploading file.");
  }
});

// Set up the Cloud Function
export const uploadFile = functions.https.onRequest(app);
