'use client';

import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
);

interface StockChartProps {
  stockData: Array<{ date: string; price: number; volume?: number }>;
  predictions: Array<{ date: string; price: number; isPrediction: boolean }>;
}

type ChartType = 'line' | 'candlestick' | 'volume' | 'indicators';

function StockChart({ stockData, predictions }: StockChartProps) {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [showTechnicals, setShowTechnicals] = useState(false);

  // Calculate technical indicators
  const technicalIndicators = useMemo(() => {
    if (stockData.length < 20) return null;

    const prices = stockData.map(d => d.price);
    
    // Simple Moving Average (20 periods)
    const sma20 = prices.map((_, index) => {
      if (index < 19) return null;
      const sum = prices.slice(index - 19, index + 1).reduce((a, b) => a + b, 0);
      return sum / 20;
    });

    // Exponential Moving Average (12 periods)
    const ema12 = [];
    const multiplier = 2 / (12 + 1);
    let ema = prices[0];
    ema12.push(ema);
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
      ema12.push(ema);
    }

    // Bollinger Bands
    const bollingerBands = prices.map((_, index) => {
      if (index < 19) return { upper: null, lower: null };
      const slice = prices.slice(index - 19, index + 1);
      const avg = slice.reduce((a, b) => a + b, 0) / 20;
      const variance = slice.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / 20;
      const stdDev = Math.sqrt(variance);
      return {
        upper: avg + (2 * stdDev),
        lower: avg - (2 * stdDev)
      };
    });

    return { sma20, ema12, bollingerBands };
  }, [stockData]);

  const allData = [...stockData, ...predictions];
  const labels = allData.map(d => d.date);
  
  const historicalPrices = stockData.map(d => d.price);
  const predictionPrices = new Array(stockData.length).fill(null).concat(
    predictions.map(p => p.price)
  );

  const lastHistoricalPrice = stockData[stockData.length - 1]?.price;
  if (lastHistoricalPrice && predictionPrices[stockData.length]) {
    predictionPrices[stockData.length - 1] = lastHistoricalPrice;
  }

  // Generate chart data based on type
  const getChartData = () => {
    const baseDatasets = [
      {
        label: 'Historical Stock Price',
        data: chartType === 'volume' ? [] : historicalPrices,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: chartType === 'line' ? 3 : 0,
        pointHoverRadius: 5,
        tension: 0.1,
        fill: chartType === 'line'
      },
      {
        label: 'AI Predictions',
        data: chartType === 'volume' ? [] : predictionPrices,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: chartType === 'line' ? 3 : 0,
        pointHoverRadius: 5,
        tension: 0.1,
        fill: chartType === 'line'
      }
    ];

    // Add technical indicators if enabled
    if (showTechnicals && technicalIndicators && chartType !== 'volume') {
      const technicalDatasets = [
        {
          label: 'SMA (20)',
          data: technicalIndicators.sma20.map(val => val || 0),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'transparent',
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 3,
          tension: 0.1,
          fill: false
        },
        {
          label: 'EMA (12)',
          data: technicalIndicators.ema12,
          borderColor: 'rgb(249, 115, 22)',
          backgroundColor: 'transparent',
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 3,
          tension: 0.1,
          fill: false
        },
        {
          label: 'Bollinger Upper',
          data: technicalIndicators.bollingerBands.map(b => b.upper || 0),
          borderColor: 'rgba(239, 68, 68, 0.5)',
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderDash: [3, 3],
          pointRadius: 0,
          pointHoverRadius: 3,
          tension: 0.1,
          fill: false
        },
        {
          label: 'Bollinger Lower',
          data: technicalIndicators.bollingerBands.map(b => b.lower || 0),
          borderColor: 'rgba(239, 68, 68, 0.5)',
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderDash: [3, 3],
          pointRadius: 0,
          pointHoverRadius: 3,
          tension: 0.1,
          fill: false
        }
      ];
      
      baseDatasets.push(...technicalDatasets);
    }

    // Volume chart data
    if (chartType === 'volume') {
      const volumeData = stockData.map(d => d.volume || Math.floor(Math.random() * 1000000));
      return {
        labels: stockData.map(d => d.date),
        datasets: [{
          label: 'Volume',
          data: volumeData,
          backgroundColor: volumeData.map((_, index) => {
            if (index === 0) return 'rgba(59, 130, 246, 0.7)';
            const prevPrice = stockData[index - 1]?.price || 0;
            const currentPrice = stockData[index]?.price || 0;
            return currentPrice >= prevPrice 
              ? 'rgba(34, 197, 94, 0.7)' 
              : 'rgba(239, 68, 68, 0.7)';
          }),
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }]
      };
    }

    return {
      labels,
      datasets: baseDatasets
    };
  };

  const data = getChartData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: chartType === 'volume' ? '📊 Trading Volume Analysis' : 
              showTechnicals ? '📈 Technical Analysis & Predictions' :
              '📈 Stock Price Analysis & Predictions',
        color: 'white',
        font: {
          size: 20,
          weight: 'bold' as const
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        callbacks: {
          label: function(context: {dataset: {label?: string}; parsed: {y: number | null}}) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += '$' + context.parsed.y.toFixed(2);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
          color: 'white'
        },
        ticks: {
          color: 'white',
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Price ($)',
          color: 'white'
        },
        ticks: {
          color: 'white',
          callback: function(value: string | number) {
            if (chartType === 'volume') {
              const num = Number(value);
              if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
              if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
              return num.toString();
            }
            return '$' + Number(value).toFixed(2);
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
      {/* Chart Controls */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Chart Type</label>
            <select 
              value={chartType} 
              onChange={(e) => setChartType(e.target.value as ChartType)}
              className="bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-blue-500"
            >
              <option value="line">📈 Line Chart</option>
              <option value="volume">📊 Volume Chart</option>
            </select>
          </div>
          
          {chartType !== 'volume' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="technicals"
                checked={showTechnicals}
                onChange={(e) => setShowTechnicals(e.target.checked)}
                className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="technicals" className="text-gray-300 text-sm">
                Show Technical Indicators
              </label>
            </div>
          )}
        </div>

        {/* Chart Statistics */}
        <div className="flex items-center gap-6 text-sm">
          {stockData.length > 0 && (
            <>
              <div className="text-center">
                <div className="text-gray-400">Current Price</div>
                <div className="text-white font-bold">
                  ${stockData[stockData.length - 1]?.price.toFixed(2)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">24h Change</div>
                <div className={`font-bold ${
                  stockData.length > 1 && 
                  stockData[stockData.length - 1]?.price >= stockData[stockData.length - 2]?.price
                    ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stockData.length > 1 && (
                    `${((stockData[stockData.length - 1]?.price - stockData[stockData.length - 2]?.price) / stockData[stockData.length - 2]?.price * 100).toFixed(2)}%`
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Data Points</div>
                <div className="text-white font-bold">{stockData.length}</div>
              </div>
              {predictions.length > 0 && (
                <div className="text-center">
                  <div className="text-gray-400">Predictions</div>
                  <div className="text-purple-400 font-bold">{predictions.length}</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[500px]">
        {chartType === 'volume' ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <Bar data={data as any} options={options} />
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <Line data={data as any} options={options} />
        )}
      </div>

      {/* Technical Indicators Legend */}
      {showTechnicals && technicalIndicators && chartType !== 'volume' && (
        <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
          <h3 className="text-white font-semibold mb-2">📊 Technical Indicators</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-green-500"></div>
                <span className="text-gray-300">SMA (20)</span>
              </div>
              <div className="text-xs text-gray-400">Simple Moving Average</div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-orange-500"></div>
                <span className="text-gray-300">EMA (12)</span>
              </div>
              <div className="text-xs text-gray-400">Exponential Moving Average</div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-red-500 border-dashed border-t-2"></div>
                <span className="text-gray-300">Bollinger Bands</span>
              </div>
              <div className="text-xs text-gray-400">Volatility Bands</div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-purple-500 border-dashed border-t-2"></div>
                <span className="text-gray-300">AI Predictions</span>
              </div>
              <div className="text-xs text-gray-400">Neural Network Forecast</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockChart;