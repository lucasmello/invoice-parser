import express, { Request } from "express";
import dotenv from "dotenv";
import fileUpload, { UploadedFile } from "express-fileupload";
import path from "path";
import {
  parseInvoice,
  getFinalCost,
  percentageOfTheCost,
  Item,
} from "./invoice-parser";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(fileUpload());
app.use(cors());

interface ExpensesResponse {
  count: number;
  totalPrice: number;
  percentage: string;
  items: Item[];
}

app.post("/upload", (req, res) => {
  let sampleFile;
  let uploadPath: string;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  sampleFile = req.files.invoice as UploadedFile;
  uploadPath = path.join(__dirname, "..", "/uploads/", sampleFile.name);
  sampleFile.mv(uploadPath, async (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    const responseBody = await createResponse(req, uploadPath);
    res.setHeader("Content-Type", "application/json");
    res.send(responseBody);
  });
});

app.get("/expense", async (req, res) => {
  const responseBody = await createResponse(
    req,
    "/home/lucas/Documents/fatura.pdf"
  );

  res.setHeader("Content-Type", "application/json");
  res.send(responseBody);
});

async function createResponse(
  req: Request,
  invoicePath: string
): Promise<ExpensesResponse> {
  let responseData = await parseInvoice(invoicePath);

  const invoiceTotal = getFinalCost(responseData).value;

  if (req.query.type) {
    responseData = responseData.filter(
      (item) =>
        item.category.toLowerCase() === req.query.type?.toString().toLowerCase()
    );
  }
  const categoryTotal = getFinalCost(responseData).value;

  for (const item of responseData) {
    const percentage = percentageOfTheCost(item.cost, categoryTotal);
    item.percentage = `${percentage}%`;
  }

  const totalPercentage = ((categoryTotal / invoiceTotal) * 100).toFixed(2);

  const responseBody = {
    count: responseData.length,
    totalPrice: categoryTotal,
    percentage: `${totalPercentage}%`,
    items: responseData,
  };

  return responseBody;
}

app.listen(port, () => {
  console.log("Server is running on port ", port);
});
