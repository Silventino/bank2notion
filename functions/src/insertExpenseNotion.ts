import { Client } from "@notionhq/client";
import Expense from "./types/expenseType.js";

const insertExpense = async (
  notion: Client,
  databaseId: string,
  expense: Expense
) => {
  return notion.pages.create({
    parent: {
      database_id: databaseId,
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
        number: expense.value,
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

export default insertExpense;
