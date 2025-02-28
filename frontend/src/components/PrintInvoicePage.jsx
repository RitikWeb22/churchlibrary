import React from "react";
import InvoiceTemplate from "./";

const PrintInvoicePage = ({ invoiceData }) => {
  return (
    <div>
      {/* Wrap the invoice content with the invoiceContainer id */}
      <div id="invoiceContainer">
        <InvoiceTemplate invoiceData={invoiceData} />
      </div>
      <div className="mt-4">
        <button className="btn btn-primary" onClick={() => window.print()}>
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default PrintInvoicePage;
