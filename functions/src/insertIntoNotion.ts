import { Client } from "@notionhq/client";
import ParsedPdfEntry from "./types/Expense.js";
import NotionPropertiesMap from "./types/Headers.js";

const insertIntoNotion = async (
  notion: Client,
  databaseId: string,
  headers: NotionPropertiesMap,
  expense: ParsedPdfEntry
) => {
  const notionProperties = Object.entries(expense).reduce(
    (acc, [key, value]) => {
      const header = headers[key];
      if (!header) {
        return acc;
      }

      switch (header.type) {
        case "title":
          acc[header.name] = {
            title: [
              {
                text: {
                  content: value,
                },
              },
            ],
          };
          break;
        case "number":
          acc[header.name] = {
            number: value,
          };
          break;
        case "select":
          acc[header.name] = {
            select: {
              name: value,
            },
          };
          break;
        case "rich_text":
          acc[header.name] = {
            rich_text: [
              {
                text: {
                  content: value,
                },
              },
            ],
          };
          break;
        case "multi_select":
          acc[header.name] = {
            multi_select: [
              {
                name: value,
              },
            ],
          };
          break;
        case "date":
          acc[header.name] = {
            date: {
              start: value,
            },
          };
          break;
        default:
          break;
      }

      return acc;
    },
    {} as Record<string, any>
  );

  return notion.pages.create({
    parent: {
      database_id: databaseId,
    },
    properties: notionProperties,
  });
};

export default insertIntoNotion;
