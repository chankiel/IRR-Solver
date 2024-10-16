import React, { useState } from 'react';

function App() {
  const [numPeriods, setNumPeriods] = useState("");
  const [contributions, setContributions] = useState([]);
  const [profits, setProfits] = useState([]);
  const [irr, setIRR] = useState(null);
  const numInputs = isNaN(parseInt(numPeriods))?2:parseInt(numPeriods)+1;

  const handlePeriodChange = (e) => {
    let value = parseInt(e.target.value);
    if(e.target.value===""){
      value = 1;
    }
    setNumPeriods(e.target.value);
    setContributions(new Array(value+1).fill(''));
    setProfits(new Array(value+1).fill(''));
    setIRR(null);
  };

  const handleContributionChange = (index, value) => {
    const newContributions = [...contributions];
    newContributions[index] = value;
    setContributions(newContributions);
  };

  const handleProfitChange = (index, value) => {
    const newProfits = [...profits];
    newProfits[index] = value;
    setProfits(newProfits);
  };

  const calculateIRR = () => {
    const cashFlows = contributions.map((contribution, index) => {
      const profit = profits[index] ? parseFloat(profits[index]) : 0;
      return -parseFloat(contribution) + profit;
    });
    const irrValue = calculateIRRNumeric(cashFlows);
    setIRR(irrValue);
  };

  const calculateIRRNumeric = (cashFlows) => {
    if (!Array.isArray(cashFlows) || cashFlows.length === 0) {
      return null;
    }

    const npv = (rate) => {
      return cashFlows.reduce((total, cf, t) => total + cf / Math.pow(1 + rate, t), 0);
    };

    const derivativeNPV = (rate) => {
      return cashFlows.reduce((total, cf, t) => total - (t * cf) / Math.pow(1 + rate, t + 1), 0);
    };

    let rate = 0.1;
    const maxIterations = 1000;
    for (let i = 0; i < maxIterations; i++) {
      const npvValue = npv(rate);
      const derNPV = derivativeNPV(rate);

      if (derNPV === 0) {
        return "Error";
      }

      const newRate = rate - npvValue / derNPV;
      if (Math.abs(newRate - rate) < 1e-6) {
        return parseFloat(newRate.toFixed(6));
      }

      rate = newRate;
    }

    return parseFloat(rate.toFixed(6));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 mb-28">
      <div className='fixed bottom-0 left-5 bg-white'>
        <h1 className='text-2xl font-bold'>
          Tugas Teori Suku Bunga
        </h1>
        <h2 className='text-xl font-semibold'>
          Mencari nilai IRR dengan Metode Numerik Newton-Raphson
        </h2>
        <p className='text-'>
          Ignatius Jhon Hezkiel Chan - 13522029
        </p>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">IRR Calculator</h1>
      <div className="mb-10 flex items-center gap-4">
        <label className="block mb-2">Enter the number of periods:</label>
        <input
          type="number"
          value={numPeriods}
          onChange={handlePeriodChange}
          min="0"
          className="border border-gray-300 rounded p-2 w-32"
          required
        />
      </div>

      {Array.from({ length: numInputs }).map((_, index) => (
        <div key={index} className="mb-4 flex gap-2 md:gap-5">
          <label className="block mb-1">
            Year {index} Contribution:
            <input
              type="number"
              value={contributions[index] || ''}
              onChange={(e) => handleContributionChange(index, e.target.value)}
              className="border border-gray-300 rounded p-2 w-32 ml-2"
              step="any"
              required
            />
          </label>
          <label className="block mb-1">
            Profit:
            <input
              type="number"
              value={profits[index] || ''}
              onChange={(e) => handleProfitChange(index, e.target.value)}
              className="border border-gray-300 rounded p-2 w-32 ml-2"
              step="any"
              required
            />
          </label>
        </div>
      ))}

      <button
        onClick={calculateIRR}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Calculate IRR
      </button>

      {irr !== null && !isNaN(irr) && irr !=="Error" && (
        <div className="mt-4">
          <h2 className="text-xl">
            The calculated IRR is: {(irr * 100).toFixed(2)}%
          </h2>
        </div>
      )}

      {irr === "Error" && (
        <h1 className='text-2xl mt-10 text-red-500 font-bold'>
          IRR Value Invalid
        </h1>
      )}
    </div>
  );
}

export default App;
