import React, { useState } from 'react';
import { Moon, Activity, Upload, Target, TrendingUp, AlertCircle, Brain, Globe } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';
import PredictionForm from './components/PredictionForm';
import ExoplanetVisualization from './components/ExoplanetVisualization';
import { predictSingleObject as apiPredict } from './services/api';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function StatCard({ icon: Icon, title, value, subtitle, color }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2" style={{ color }}>{value}</p>
          {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
        <Icon className="w-12 h-12 opacity-20" style={{ color }} />
      </div>
    </div>
  );
}

export default function App() {
  const [csvData, setCsvData] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');

  const [showPredictionForm, setShowPredictionForm] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [llmAnalysis, setLlmAnalysis] = useState('');
  const [showAdvancedResults, setShowAdvancedResults] = useState(false);

  // 🚀 Nueva función: tomar los datos CSV y mandar al backend
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: async (result) => {
          try {
            setCsvData(result.data);
            // Mandamos directamente al backend
            const response = await apiPredict({ lightcurve: result.data });

            if (response.success) {
              setResults(response);
              setPredictionResult(response);
              setLlmAnalysis(response.llm_analysis || 'No analysis provided.');
              setShowAdvancedResults(true);
              setActiveTab('results');
            } else {
              alert('Error en predicción: backend no devolvió success');
            }
          } catch (error) {
            console.error('Error procesando archivo CSV:', error);
            alert('Error al enviar los datos al backend.');
          } finally {
            setLoading(false);
          }
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          setLoading(false);
        }
      });
    }
  };

  // 🚀 Predicción desde formulario (objeto individual)
  const handlePredict = async (data) => {
    setLoading(true);
    try {
      const result = await apiPredict(data);
      if (result.success) {
        setPredictionResult(result);
        setResults(result);
        setLlmAnalysis(result.llm_analysis || 'No analysis provided.');
        setShowAdvancedResults(true);
        setActiveTab('results');
      }
      setShowPredictionForm(false);
    } catch (error) {
      console.error('Error en predicción:', error);
      alert('Error al realizar la predicción. Verifica los datos de entrada.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      {/* Header */}
      <div className="bg-black bg-opacity-30 backdrop-blur-sm border-b border-white border-opacity-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Moon className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Exoplanet Detection System</h1>
                <p className="text-blue-300 text-sm">NASA Space Apps Challenge 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="btn-predict-single"
                onClick={() => setShowPredictionForm(true)}
              >
                🔭 Predict Single Object
              </button>
              <div className="flex items-center space-x-2 bg-blue-500 bg-opacity-20 px-4 py-2 rounded-lg">
                <Activity className="w-5 h-5 text-green-400" />
                <span className="text-white text-sm font-medium">Model Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-6 mt-6">
        <div className="flex space-x-2 bg-black bg-opacity-20 backdrop-blur-sm rounded-lg p-1">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${activeTab === 'upload'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-blue-200 hover:bg-white hover:bg-opacity-10'
              }`}
          >
            <Upload className="w-5 h-5 inline mr-2" />
            Upload Data
          </button>
          <button
            onClick={() => setActiveTab('results')}
            disabled={!results}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${activeTab === 'results' && results
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-blue-200 hover:bg-white hover:bg-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
          >
            <Target className="w-5 h-5 inline mr-2" />
            Analysis Results
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            disabled={!showAdvancedResults}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${activeTab === 'advanced' && showAdvancedResults
                ? 'bg-purple-500 text-white shadow-lg'
                : 'text-purple-200 hover:bg-white hover:bg-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
          >
            <Globe className="w-5 h-5 inline mr-2" />
            Advanced Analysis
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl p-8">
              <div className="text-center">
                <Upload className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Light Curve Data</h2>
                <p className="text-gray-600 mb-6">
                  Upload your CSV file containing light curve measurements
                </p>
              </div>

              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="text-4xl">📊</div>
                    <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
                    <p className="text-gray-500 text-sm">CSV files with light curve data</p>
                  </div>
                </label>
              </div>

              {loading && (
                <div className="mt-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="text-gray-600 mt-2">Processing data...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'results' && results && (
          <div className="space-y-6">
            {/* Banner */}
            <div className={`rounded-xl shadow-lg p-6 ${results.prediction === 'CONFIRMED'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gradient-to-r from-orange-500 to-red-600'
              }`}>
              <div className="flex items-center justify-between text-white">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {results.prediction === 'CONFIRMED' ? '🎉 Exoplanet Detected!' : '🔍 No Exoplanet Detected'}
                  </h2>
                  <p className="text-lg opacity-90">
                    Classification Confidence: {Math.max(...Object.values(results.probabilities)).toFixed(1)}%
                  </p>
                </div>
                <Target className="w-20 h-20 opacity-30" />
              </div>
            </div>

            {/* 3D Exoplanet Visualization */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-2 text-blue-500" />
                3D Exoplanet Visualization
              </h3>
              <ExoplanetVisualization features={results.features} />
            </div>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && showAdvancedResults && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Brain className="w-6 h-6 mr-2 text-purple-500" />
                AI-Powered Analysis
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm leading-relaxed prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {llmAnalysis}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPredictionForm && (
        <PredictionForm
          onClose={() => setShowPredictionForm(false)}
          onPredict={handlePredict}
        />
      )}
    </div>
  );
}
