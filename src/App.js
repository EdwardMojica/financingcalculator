import React, { useState } from "react";
import { Landmark, Shield, FileText, Calculator } from "lucide-react";
import "./App.css"; //

export default function UsedCarFinanceCalculator() {
  const [dealerAskingPrice, setDealerAskingPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [insurance, setInsurance] = useState("");
  const [ltoTransfer, setLtoTransfer] = useState("");

  const parseNumber = (val) => {
    const num = parseInt(val.replace(/,/g, "")) || 0;
    return num < 0 ? 0 : num;
  };

  const dealerAskingPriceNum = parseNumber(dealerAskingPrice);
  const downPaymentNum = parseNumber(downPayment);
  const insuranceNum = parseNumber(insurance);
  const ltoTransferNum = parseNumber(ltoTransfer);

  const loanBase = dealerAskingPriceNum - downPaymentNum;
  const cmf = loanBase * 0.07;
  const totalCashOut = downPaymentNum + insuranceNum + ltoTransferNum + cmf;

  const multipliers = { 12: 1.168, 24: 1.336, 36: 1.504, 48: 1.672, 60: 1.765 };
  const order = [48, 36, 24, 12, 60];

  const terms = order.map((term) => {
    const monthlyPayment = (loanBase * multipliers[term]) / term;
    return { months: term, monthlyPayment };
  });

  const formatCurrency = (num) =>
    num.toLocaleString("en-PH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const handleInputChange = (setter) => (e) => {
    let val = e.target.value.replace(/,/g, "");
    if (val === "") {
      setter("");
    } else {
      const num = Math.max(0, parseInt(val) || 0);
      setter(num.toLocaleString());
    }
  };

  return (
    <div className="app-container">
      <div className="calculator-card">
        <h1 className="title">
          <Calculator className="icon" /> Financing Calculator
        </h1>

        {/* Inputs */}
        <div className="form-grid">
          <div className="form-group">
            <label><Landmark className="label-icon" /> Dealer Asking Price (₱)</label>
            <input type="text" value={dealerAskingPrice} onChange={handleInputChange(setDealerAskingPrice)} />
          </div>

          <div className="form-group">
            <label><Landmark className="label-icon" /> Down Payment (₱)</label>
            <input type="text" value={downPayment} onChange={handleInputChange(setDownPayment)} />
          </div>

          <div className="form-group">
            <label><Shield className="label-icon" /> Insurance (₱)</label>
            <input type="text" value={insurance} onChange={handleInputChange(setInsurance)} />
          </div>

          <div className="form-group">
            <label><FileText className="label-icon" /> LTO Transfer (₱)</label>
            <input type="text" value={ltoTransfer} onChange={handleInputChange(setLtoTransfer)} />
          </div>

          <div className="form-group">
            <label>Chattel Mortgage Fee (₱)</label>
            <input type="text" value={formatCurrency(cmf)} readOnly className="readonly" />
          </div>

          <div className="form-group">
            <label>Total Amount Financed (₱)</label>
            <input type="text" value={formatCurrency(loanBase)} readOnly className="readonly green" />
          </div>
        </div>

        {/* Total Cash Out */}
        <div className="total-box">
          <h2>Total Cash Out</h2>
          <p>₱{formatCurrency(totalCashOut)}</p>
        </div>

        {/* Results Table */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Term (Months)</th>
                <th>Monthly Payment (₱)</th>
              </tr>
            </thead>
            <tbody>
              {terms.map((t) => (
                <tr key={t.months}>
                  <td>
                    {t.months}
                    {t.months === 60 && (
                      <span className="note"> (Only for Japanese cars 2022+)</span>
                    )}
                  </td>
                  <td>{formatCurrency(t.monthlyPayment)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
