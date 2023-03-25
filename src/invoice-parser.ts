import currency from 'currency.js';
import fs from 'fs';
import pdf from "pdf-parse"

const expensesRegex = new RegExp(/([0-9]+\/[0-9]+[A-Za-z].+)/, 'g')
const regexPositiveCosts = /BRL([0-9]+\.?[0-9]+,[0-9]+)/
const regexNegativeCosts = /BRL-([0-9]+\.?[0-9]+,[0-9]+)/;
const descRegex = /[0-9]+\/[0-9]+(.+)BRL/
const dateRegex = /[0-9]+\/[0-9]+/

function extractDescription(row: string) {
  return descRegex.exec(row)?.[1].trim()
}

function extractCurrency(row: string) {
  return currency(row.replace('.', '').replace(',', '.'))
}

function extractDate(row: string) {
  return dateRegex.exec(row)?.[0]
}

function sanitize(str: string) {
  return str.replace(/\0/g, '')
}

function parseExpenses(expenses: Array<string>) {
  const parsedExpenses = []
  for (const exp of expenses) {
    const match = regexPositiveCosts.exec(exp)
    const matchNegative = regexNegativeCosts.exec(exp)
    if (match) {
      parsedExpenses.push({
        description: extractDescription(exp),
        cost: extractCurrency(match[1]).value,
        date: extractDate(exp)
      })
    }    
  }
  return parsedExpenses
}

async function test() {

    let dataBuffer = fs.readFileSync('/home/lucas/Projects/Invoice Parser/src/fatura.pdf')

    const expenses: string[] = []

    await pdf(dataBuffer).then(data => {
        let match = expensesRegex.exec(data.text)
        while (match != null) {          
          if (!match[0].includes('PAGAMENTO')) {
            expenses.push(sanitize(match[0]))
          }
          
          match = expensesRegex.exec(data.text)
        }
    }).catch(e => console.error(e))


    console.log(parseExpenses(expenses))

    
    // const costs = []
    // const negativeCosts = []

    // for (const exp of expenses) {        
        
    //     const match = regexPositiveCosts.exec(exp);
    //     const matchNegative = regexNegativeCosts.exec(exp);

    //     if (match) {          
    //       const price = extractCurrency(match[1])
    //       costs.push(price)
    //     } else if (matchNegative) {
    //         const price = extractCurrency(matchNegative[1])
    //         negativeCosts.push(price)
    //     }
    // }

    // const sums = costs.reduce((acc, val) => {
    //   return acc.add(val);
    // }, currency(0));

    // const negSum = negativeCosts.reduce((acc, val) => {
    //   return acc.add(val);
    // }, currency(0));

    // console.log("POSITIVE: ", sums.value)
    // console.log("NEGATIVE: ", negSum.value)

    // console.log("TOTAL COST: ", (sums.add(180.40)).subtract(negSum).value)
}

test()


// 52 CAFE BISTRO COMERCI 25/02