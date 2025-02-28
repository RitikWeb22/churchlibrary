import React from "react";

/**
 * Updated InvoiceTemplate
 *
 * - Forces a white background & black text for printing
 * - Uses inline styles to avoid conflicts with dark mode or Tailwind
 */
const InvoiceTemplate = ({ invoiceData = {} }) => {
  const {
    invoiceNumber = "N/A",
    logo = "",
    userName = "",
    contactNumber = "",
    purchaseDate = new Date().toISOString(),
    bookName = "",
    language = "",
    quantity = 1,
    price = 0,
  } = invoiceData;

  // Format date
  const formattedDate = new Date(purchaseDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Totals
  const lineTotal = quantity * price;
  const subtotal = lineTotal;
  const tax = 0;
  const total = subtotal + tax;

  return (
    <div
      id="invoiceContainer"
      style={{
        width: "794px", // ~A4 width at 96 DPI
        margin: "0 auto",
        backgroundColor: "#FFFFFF",
        color: "#000000",
        border: "1px solid #E5E7EB",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#2563EB",
          color: "#FFFFFF",
          padding: "1rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "2rem", margin: 0 }}>Invoice</h1>
            <p style={{ margin: 0 }}>Invoice Number: {invoiceNumber}</p>
          </div>
          {logo && (
            <div>
              <img
                src={logo}
                alt="Logo"
                style={{ width: "80px", height: "auto" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Invoice Details */}
      <div style={{ padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* Billing Info */}
          <div>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem 0" }}>
              Bill To
            </h2>
            <p style={{ margin: 0 }}>{userName}</p>
            <p style={{ margin: 0 }}>{contactNumber}</p>
          </div>

          {/* Invoice Date */}
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0 }}>Invoice Date: {formattedDate}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div style={{ padding: "0 1rem 1rem 1rem" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #E5E7EB",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#F3F4F6" }}>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                Item
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                Language
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "right",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                Quantity
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "right",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                Unit Price
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "right",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  padding: "0.75rem",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                {bookName}
              </td>
              <td
                style={{
                  padding: "0.75rem",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                {language}
              </td>
              <td
                style={{
                  padding: "0.75rem",
                  textAlign: "right",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                {quantity}
              </td>
              <td
                style={{
                  padding: "0.75rem",
                  textAlign: "right",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                ₹{Number(price).toFixed(2)}
              </td>
              <td
                style={{
                  padding: "0.75rem",
                  textAlign: "right",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                ₹{lineTotal.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "0 1rem 1rem 1rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "250px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #E5E7EB",
              padding: "0.5rem 0",
            }}
          >
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #E5E7EB",
              padding: "0.5rem 0",
            }}
          >
            <span>Tax</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.5rem 0",
            }}
          >
            <span style={{ fontWeight: "bold" }}>Total</span>
            <span style={{ fontWeight: "bold" }}>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#F9FAFB",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <p style={{ margin: 0 }}>Thank you for your business!</p>
        <p style={{ margin: 0, fontSize: "0.875rem" }}>
          If you have any questions about this invoice, please contact us at
          info@example.com.
        </p>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
