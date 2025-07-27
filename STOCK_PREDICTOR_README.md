# Stock Market Predictor Integration - Assignment 4 Part 2

## Overview
This is Part 2 of Assignment 4, where the stock market prediction functionality from Part 1 has been integrated into the MERN Full-Stack template from Assignment 3.

## Features Added
- **Stock Predictor Page**: Accessible at `/stock-predictor` (requires authentication)
- **Neural Network Model**: Uses Brain.js for stock price prediction
- **Data Visualization**: Interactive charts using Chart.js
- **Responsive UI**: Fully integrated with the existing template design

## Components
1. **PredictionModel**: Neural network engine with customizable parameters
2. **StockChart**: Visualization of historical and predicted data
3. **DataInput**: Interface for loading custom stock data

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Login to access the Stock Predictor feature in the navigation menu

## Technical Details
- **Architecture**: Feedforward Neural Network
- **Hidden Layers**: [15, 10, 8]
- **Training Iterations**: 3,000
- **Prediction Window**: 10 days
- **Data Requirements**: Minimum 50 historical data points

## Integration Changes
- Added Chart.js and react-chartjs-2 dependencies
- Created new page route at `/app/stock-predictor`
- Updated navigation to include Stock Predictor link
- Protected route with authentication middleware
- Brain.js loaded via CDN for compatibility

## Stock Data Format
```json
[
  { "date": "2024-01-01", "price": 100.00 },
  { "date": "2024-01-02", "price": 102.50 },
  ...
]
```

## Model Performance
The neural network uses:
- Sigmoid activation function
- Learning rate of 0.03
- Error threshold of 0.003
- 5-day sliding window for predictions