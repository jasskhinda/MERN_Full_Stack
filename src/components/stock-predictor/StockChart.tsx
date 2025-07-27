'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StockChartProps {
  stockData: Array<{ date: string; price: number }>;
  predictions: Array<{ date: string; price: number; isPrediction: boolean }>;
}

function StockChart({ stockData, predictions }: StockChartProps) {
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

  const data = {
    labels,
    datasets: [
      {
        label: 'Historical Stock Price',
        data: historicalPrices,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.1,
        fill: true
      },
      {
        label: 'AI Predictions',
        data: predictionPrices,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.1,
        fill: true
      }
    ]
  };

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
        text: '📈 Stock Price Analysis & Predictions',
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
          label: function(context: any) {
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
          callback: function(value: any) {
            return '$' + value.toFixed(2);
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
      <div className="h-[500px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default StockChart;