'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

interface RealTimeTickerProps {
  onStockSelect: (symbol: string) => void;
  selectedStock: string;
}

const POPULAR_STOCKS = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'NFLX'];

function RealTimeTicker({ onStockSelect, selectedStock }: RealTimeTickerProps) {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchStockData = useCallback(async () => {
    try {
      const response = await fetch('/api/stocks/realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbols: POPULAR_STOCKS }),
      });

      if (response.ok) {
        const result = await response.json();
        setStocks(result.data);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Failed to fetch stock data:', error);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchStockData();

    // Set up real-time updates
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isLive) {
      intervalId = setInterval(fetchStockData, 3000); // Update every 3 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLive, fetchStockData]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">📈 Real-Time Market Data</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              isLive 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isLive ? '⏸️ Pause Live' : '▶️ Start Live'}
          </button>
          <button
            onClick={fetchStockData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {lastUpdate && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
          <span>Last updated: {lastUpdate}</span>
          {isLive && <span className="text-green-400">(Live updates enabled)</span>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            onClick={() => onStockSelect(stock.symbol)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:scale-105 ${
              selectedStock === stock.symbol
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold text-lg">{stock.symbol}</h3>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${
                stock.change >= 0 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {stock.change >= 0 ? '📈' : '📉'}
              </div>
            </div>
            
            <div className="text-2xl font-bold text-white mb-1">
              ${stock.price.toFixed(2)}
            </div>
            
            <div className={`text-sm font-semibold ${
              stock.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} 
              ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </div>
            
            <div className="text-gray-400 text-xs mt-2">
              Vol: {formatNumber(stock.volume)}
            </div>
          </div>
        ))}
      </div>

      {stocks.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-gray-400">Loading market data...</div>
        </div>
      )}
    </div>
  );
}

export default RealTimeTicker;