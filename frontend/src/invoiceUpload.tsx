import axios from 'axios';
import React, { useState } from 'react';

interface Expense {
    description: string;
    cost: number;
    date: string;
    category: string;
  }

function InvoiceUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<Expense[]>();

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
        <div>
      <h2>Expense List</h2>
      <table style={{ borderCollapse: 'collapse', border: '1px solid black' }}>
        <thead>
          <tr>
          <th style={{ border: '1px solid black' }}>Data</th>
          <th style={{ border: '1px solid black' }}>Valor</th>
          <th style={{ border: '1px solid black' }}>Descrição</th>
           <th style={{ border: '1px solid black' }}>Categoria</th>
          </tr>
        </thead>
        <tbody>
          {response.map((expense, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black' }}>{expense.date}</td>
              <td style={{ border: '1px solid black' }}>{expense.description}</td>
              <td style={{ border: '1px solid black' }}>{expense.cost}</td>              
              <td style={{ border: '1px solid black' }}>{expense.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
