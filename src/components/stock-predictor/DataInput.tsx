'use client';

import React from 'react';

interface DataInputProps {
  stockData: Array<{ date: string; price: number }>;
  setStockData: (data: Array<{ date: string; price: number }>) => void;
}

function DataInput({ stockData, setStockData }: DataInputProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json) && json.length >= 50) {
          setStockData(json);
          alert('Data loaded successfully!');
        } else {
          alert('Please provide at least 50 data points');
        }
      } catch {
        alert('Invalid JSON format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
        <span className="mr-2">📊</span> Data Input
      </h2>
      <div className="space-y-4">
        <div className="bg-gray-700/50 p-4 rounded">
          <p className="text-sm text-gray-300 mb-2">Current Dataset:</p>
          <p className="text-lg font-semibold text-white">{stockData.length} data points loaded</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload Custom Data (JSON)
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white 
                     file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 
                     file:text-sm file:font-semibold file:bg-blue-600 file:text-white 
                     hover:file:bg-blue-700 cursor-pointer"
          />
        </div>
        <div className="text-xs text-gray-400">
          <p>Format: {`[{"date": "YYYY-MM-DD", "price": 100.00}]`}</p>
          <p>Minimum 50 data points required</p>
        </div>
      </div>
    </div>
  );
}

export default DataInput;