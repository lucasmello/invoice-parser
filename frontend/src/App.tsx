import React from 'react';
import './App.css';
import InvoiceUpload from './invoiceUpload';

function App() {
  console.log("Starting")

  return (
    <div>
      <h1>Fatura</h1>
      <InvoiceUpload />
    </div>
  );  
}

export default App;
