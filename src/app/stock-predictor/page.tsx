'use client';

import { useState, useCallback } from 'react';
import DataInput from '@/components/stock-predictor/DataInput';
import PredictionModel from '@/components/stock-predictor/PredictionModel';
import StockChart from '@/components/stock-predictor/StockChart';
import RealTimeTicker from '@/components/stock-predictor/RealTimeTicker';
import { stockData as defaultStockData } from '@/lib/stockData';

export default function StockPredictor() {
  const [stockData, setStockData] = useState(defaultStockData);
  const [predictions, setPredictions] = useState<Array<{ date: string; price: number; isPrediction: boolean }>>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [selectedStock, setSelectedStock] = useState('AAPL');

  const handleStockSelect = useCallback(async (symbol: string) => {
    setSelectedStock(symbol);
    setPredictions([]); // Clear previous predictions
    
    try {
      // Fetch historical data for the selected stock
      const response = await fetch(`/api/stocks/realtime?symbol=${symbol}&type=historical&days=30`);
      if (response.ok) {
        const result = await response.json();
        setStockData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch historical data:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            AI Stock Market Predictor
          </h1>
          <p className="text-xl text-gray-300">
            Harness the power of neural networks to predict stock market trends
          </p>
        </header>

        {/* Real-Time Market Data */}
        <div className="mb-8">
          <RealTimeTicker 
            onStockSelect={handleStockSelect}
            selectedStock={selectedStock}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StockChart 
              stockData={stockData} 
              predictions={predictions}
            />
          </div>
          <div className="space-y-6">
            <DataInput 
              stockData={stockData}
              setStockData={setStockData}
            />
            <PredictionModel 
              stockData={stockData}
              setPredictions={setPredictions}
              isTraining={isTraining}
              setIsTraining={setIsTraining}
            />
          </div>
        </div>
      </div>
    </div>
  );
}