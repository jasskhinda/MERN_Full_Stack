import { NextRequest, NextResponse } from 'next/server';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

// Mock real-time stock data generator
const generateMockStockData = (symbol: string): StockData => {
  // Base prices for different stocks
  const basePrices: { [key: string]: number } = {
    'AAPL': 175.50,
    'GOOGL': 140.25,
    'MSFT': 415.30,
    'TSLA': 245.80,
    'AMZN': 155.90,
    'META': 325.60,
    'NVDA': 875.20,
    'NFLX': 450.15
  };

  const basePrice = basePrices[symbol] || 100;
  
  // Generate realistic price movement
  const volatility = 0.02; // 2% volatility
  const randomChange = (Math.random() - 0.5) * 2 * volatility;
  const price = basePrice * (1 + randomChange);
  const change = price - basePrice;
  const changePercent = (change / basePrice) * 100;
  
  // Generate volume
  const baseVolume = 1000000;
  const volume = Math.floor(baseVolume * (0.5 + Math.random()));

  return {
    symbol,
    price: Number(price.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    volume,
    timestamp: new Date().toISOString()
  };
};

// Generate historical data for predictions
const generateHistoricalData = (symbol: string, days: number = 30) => {
  const data = [];
  const basePrices: { [key: string]: number } = {
    'AAPL': 175.50,
    'GOOGL': 140.25,
    'MSFT': 415.30,
    'TSLA': 245.80,
    'AMZN': 155.90,
    'META': 325.60,
    'NVDA': 875.20,
    'NFLX': 450.15
  };

  let currentPrice = basePrices[symbol] || 100;
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic price movement with some trend
    const dailyVolatility = 0.03;
    const trendFactor = Math.sin(i / 10) * 0.005; // Subtle trend
    const randomChange = (Math.random() - 0.5) * 2 * dailyVolatility + trendFactor;
    
    currentPrice = currentPrice * (1 + randomChange);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Number(currentPrice.toFixed(2)),
      volume: Math.floor(1000000 * (0.5 + Math.random()))
    });
  }

  return data;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'AAPL';
    const type = searchParams.get('type') || 'current'; // 'current' or 'historical'
    const days = parseInt(searchParams.get('days') || '30');

    if (type === 'historical') {
      const historicalData = generateHistoricalData(symbol, days);
      return NextResponse.json({
        symbol,
        data: historicalData,
        type: 'historical'
      });
    }

    // Return current/real-time data
    const currentData = generateMockStockData(symbol);
    return NextResponse.json({
      symbol,
      data: currentData,
      type: 'realtime'
    });

  } catch (error) {
    console.error('Stock data API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { symbols } = await request.json();
    
    if (!Array.isArray(symbols)) {
      return NextResponse.json(
        { error: 'Symbols must be an array' },
        { status: 400 }
      );
    }

    const stockData = symbols.map(symbol => generateMockStockData(symbol));
    
    return NextResponse.json({
      data: stockData,
      type: 'realtime',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Bulk stock data API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bulk stock data' },
      { status: 500 }
    );
  }
}