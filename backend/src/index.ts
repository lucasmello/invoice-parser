import express from "express";
import dotenv from "dotenv";
import fileUpload, { UploadedFile } from "express-fileupload";
import path from "path";
import { parseInvoice, sumValues } from "./invoice-parser";
import cors from "cors"

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(fileUpload());
app.use(cors())

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
    const parsedInvoice = await parseInvoice(uploadPath);
    res.setHeader("Content-Type", "application/json");
    res.send(parsedInvoice);
  });
});

app.get("/expense", async (req, res) => {
  let responseData = await parseInvoice(
    "/home/lucas/Projects/InvoiceParser/uploads/fatura.pdf"
  );

  if (req.query.type) {
    responseData = responseData.filter(
      (item) =>
        item.category.toLowerCase() === req.query.type?.toString().toLowerCase()
    );
  }
  const responseBody = {
    count: responseData.length,
    totalPrice: sumValues(responseData).value,
    items: responseData,
  };
  res.setHeader("Content-Type", "application/json");
  res.send(responseBody);
});

app.listen(port, () => {
  console.log("Server is running on port ", port);
});