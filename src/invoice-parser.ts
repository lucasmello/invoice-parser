import currency from "currency.js";
import fs from "fs";
import pdf from "pdf-parse";
import { Category } from "./categories-types";
import categories from "./categories.json";

const expensesRegex = new RegExp(/([0-9]+\/[0-9]+[A-Za-z].+)/, "g");
const regexPositiveCosts = /BRL([0-9]+\.?[0-9]+,[0-9]+)/;
const regexNegativeCosts = /BRL-([0-9]+\.?[0-9]+,[0-9]+)/;
const descRegex = /[0-9]+\/[0-9]+(.+)BRL/;
const dateRegex = /[0-9]+\/[0-9]+/;

function extractDescription(row: string) {
  const result = descRegex.exec(row)?.[1].trim();
  return result ? result : "";
}

function extractCurrency(row: string) {
  return currency(row.replace(".", "").replace(",", "."));
}

function extractDate(row: string) {
  return dateRegex.exec(row)?.[0];
}

function sanitize(str: string) {
  return str.replace(/\0/g, "");
}

function parseExpenses(expenses: Array<string>) {
  const parsedExpenses = [];
  for (const exp of expenses) {
    const match = regexPositiveCosts.exec(exp);
    const matchNegative = regexNegativeCosts.exec(exp);
    if (match) {
      const description = extractDescription(exp);
      parsedExpenses.push({
        description: description,
        cost: extractCurrency(match[1]).value,
        date: extractDate(exp),
        category: categorize(description),
      });
    }
  }
  return parsedExpenses;
}

function categorize(place: string): Category {
  for (const cat of categories.foodDelivery.places) {
    if (place.toLowerCase().includes(cat.toLowerCase())) {
      return "FoodDelivery";
    }
  }
  for (const cat of categories.party.places) {
    if (place.toLowerCase().includes(cat.toLowerCase())) {
      return "Party";
    }
  }
  for (const cat of categories.transport.places) {
    if (place.toLowerCase().includes(cat.toLowerCase())) {
      return "Transport";
    }
  }
  for (const cat of categories.dating.places) {
    if (place.toLowerCase().includes(cat.toLowerCase())) {
      return "Dating";
    }
  }
  for (const cat of categories.groceries.places) {
    if (place.toLowerCase().includes(cat.toLowerCase())) {
      return "Groceries";
    }
  }
  return "Other";
}

export function sumValues(items: any) {
  let finalValue = currency(0);
  for (const item of items) {
    finalValue = finalValue.add(item.cost);
  }
  return finalValue;
}

export async function parseInvoice(invoicePath: string) {
  let dataBuffer = fs.readFileSync(invoicePath);

  const expenses: string[] = [];

  await pdf(dataBuffer)
    .then((data) => {
      let match = expensesRegex.exec(data.text);
      while (match != null) {
        if (!match[0].includes("PAGAMENTO")) {
          expenses.push(sanitize(match[0]));
        }

        match = expensesRegex.exec(data.text);
      }
    })
    .catch((e) => console.error(e));

  return parseExpenses(expenses);
}

// 52 CAFE BISTRO COMERCI 25/02
