import axios from 'axios';
import currency from 'currency.js';
import React, { useState } from 'react';
import './table-style.css'

interface ExpensesResponse {
  count: number,
  totalPrice: number,
  percentage: string,
  items: Expense[]
}

interface Expense {
    percentage: string;
    description: string;
    cost: number;
    date: string;
    category: string;
  }

function InvoiceUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<ExpensesResponse>();

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    const formData = new FormData();
    setFile(file ?? null)
    if (!file) return

    formData.append('invoice', file);

    try {
      axios.post("http://localhost:5564/upload", formData).then((response) => {      
        setResponse(response.data)
    });
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  if (response) {
    console.log(response)
    return (

    <><div>
      <span style={{fontSize: "24px"}}>Valor Total: </span>
      <span style={{fontSize: "24px"}}>R${response.totalPrice.toString().replace('.', ',')} *</span>
      <br></br><br></br>
      <span style={{fontSize: "24px"}}>Compras Realizadas: </span>
      <span style={{fontSize: "24px"}}>{response.count}</span>
    </div>
    
    <div>
        <h2>Detalhes da Fatura</h2>
        <table className='stripped bordered expense'>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Categoria</th>
              <th>Porcentagem do Gasto</th>
            </tr>
          </thead>
          <tbody>
            {response.items.map((expense, index) => (
              <tr key={index}>
                <td>{expense.date}</td>
                <td>{expense.description}</td>
                <td>{currency(expense.cost).format({ pattern: 'R$#', decimal: ',' })}</td>
                <td>{expense.category}</td>
                <td>{expense.percentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <span>* Valor aproximado. O valor total pode diferir do valor original.</span>
      </>
    );
  }

  return (
    <div>
      <h2>File Upload</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default InvoiceUpload;
