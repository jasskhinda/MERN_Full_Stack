'use client';

import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    brain: {
      NeuralNetwork: new (config: {
        hiddenLayers: number[];
        activation: string;
        learningRate: number;
      }) => {
        trainAsync: (data: Array<{input: number[]; output: number[]}>, options: {
          iterations: number;
          errorThresh: number;
          log: boolean;
          logPeriod: number;
          callback: (data: {iterations: number}) => void;
        }) => Promise<void>;
        run: (input: number[]) => number[];
      };
    };
  }
}

interface PredictionModelProps {
  stockData: Array<{ date: string; price: number }>;
  setPredictions: (predictions: Array<{ date: string; price: number; isPrediction: boolean }>) => void;
  isTraining: boolean;
  setIsTraining: (training: boolean) => void;
}

function PredictionModel({ stockData, setPredictions, isTraining, setIsTraining }: PredictionModelProps) {
  const [trainingStatus, setTrainingStatus] = useState('');
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.brain) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/brain.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const normalizeData = (data: Array<{ date: string; price: number }>) => {
    const prices = data.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return prices.map(price => (price - min) / (max - min));
  };

  const denormalizePrice = (normalized: number, min: number, max: number) => {
    return normalized * (max - min) + min;
  };

  const prepareTrainingData = (normalizedPrices: number[], windowSize = 5) => {
    const trainingData = [];
    for (let i = windowSize; i < normalizedPrices.length; i++) {
      const input = normalizedPrices.slice(i - windowSize, i);
      const output = [normalizedPrices[i]];
      trainingData.push({ input, output });
    }
    return trainingData;
  };

  const calculateTrend = (predictions: Array<{ date: string; price: number; isPrediction: boolean }>) => {
    if (predictions.length < 2) return null;
    const firstPrice = predictions[0].price;
    const lastPrice = predictions[predictions.length - 1].price;
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;
    return {
      direction: change >= 0 ? 'up' : 'down',
      percentage: Math.abs(change).toFixed(2)
    };
  };

  const trainModel = async () => {
    if (!window.brain) {
      alert('Brain.js is still loading. Please try again in a moment.');
      return;
    }

    setIsTraining(true);
    setTrainingStatus('Initializing AI model...');
    setConfidence(0);

    try {
      const prices = stockData.map(d => d.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      
      const normalizedPrices = normalizeData(stockData);
      const trainingData = prepareTrainingData(normalizedPrices);

      setTrainingStatus('🧠 Training neural network...');

      const net = new window.brain.NeuralNetwork({
        hiddenLayers: [15, 10, 8],
        activation: 'sigmoid',
        learningRate: 0.03
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      await net.trainAsync(trainingData, {
        iterations: 3000,
        errorThresh: 0.003,
        log: true,
        logPeriod: 100,
        callback: (data: {iterations: number}) => {
          const progress = Math.min((data.iterations / 3000) * 100, 100);
          setConfidence(progress);
          setTrainingStatus(`🔥 Training... ${progress.toFixed(0)}% complete`);
        }
      });

      setTrainingStatus('🚀 Generating predictions...');

      const lastWindowSize = 5;
      const lastWindow = normalizedPrices.slice(-lastWindowSize);
      const predictions = [];
      const currentInput = [...lastWindow];

      for (let i = 0; i < 10; i++) {
        const prediction = net.run(currentInput)[0];
        const denormalizedPrice = denormalizePrice(prediction, min, max);
        
        const lastDate = new Date(stockData[stockData.length - 1].date);
        const predictionDate = new Date(lastDate);
        predictionDate.setDate(predictionDate.getDate() + i + 1);
        
        predictions.push({
          date: predictionDate.toISOString().split('T')[0],
          price: denormalizedPrice,
          isPrediction: true
        });

        currentInput.shift();
        currentInput.push(prediction);
      }

      setPredictions(predictions);
      const trend = calculateTrend(predictions);
      setTrainingStatus(`✅ Prediction complete! Model confidence: ${confidence.toFixed(1)}%`);
      
      if (trend) {
        setTimeout(() => {
          setTrainingStatus(`🎯 10-day forecast shows ${trend.direction === 'up' ? '📈 upward' : '📉 downward'} trend of ${trend.percentage}%`);
        }, 2000);
      }
      
    } catch (error) {
      setTrainingStatus('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-white">🤖 Neural Network Engine</h2>
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="bg-gray-700/50 p-3 rounded">
          <div className="text-gray-400">Architecture</div>
          <div className="text-white font-semibold">Feedforward NN</div>
        </div>
        <div className="bg-gray-700/50 p-3 rounded">
          <div className="text-gray-400">Hidden Layers</div>
          <div className="text-white font-semibold">[15, 10, 8]</div>
        </div>
        <div className="bg-gray-700/50 p-3 rounded">
          <div className="text-gray-400">Training Iterations</div>
          <div className="text-white font-semibold">3,000</div>
        </div>
        <div className="bg-gray-700/50 p-3 rounded">
          <div className="text-gray-400">Window Size</div>
          <div className="text-white font-semibold">5 days</div>
        </div>
        <div className="bg-gray-700/50 p-3 rounded">
          <div className="text-gray-400">Learning Rate</div>
          <div className="text-white font-semibold">0.03</div>
        </div>
        <div className="bg-gray-700/50 p-3 rounded">
          <div className="text-gray-400">Prediction Horizon</div>
          <div className="text-white font-semibold">10 days</div>
        </div>
      </div>
      
      <button 
        onClick={trainModel} 
        disabled={isTraining}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
          isTraining 
            ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
        }`}
      >
        {isTraining ? '⚡ Training AI Model...' : '🚀 Launch Prediction Engine'}
      </button>
      
      {trainingStatus && (
        <div className="mt-4 bg-gray-700/50 p-4 rounded-lg">
          {isTraining && (
            <div className="flex justify-center mb-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
          <p className="text-center text-white">{trainingStatus}</p>
          {isTraining && confidence > 0 && (
            <div className="mt-3">
              <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PredictionModel;