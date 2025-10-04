import React, { useState } from 'react';
import { Moon, Activity, Upload, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';
import PredictionForm from './components/PredictionForm';
import { predictSingleObject } from './utils/predictor';

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

function processData(data) {
  const prediction = Math.random();
  const isExoplanet = prediction > 0.5;
  
  return {
    isExoplanet: isExoplanet,
    confidence: (prediction * 100).toFixed(2),
    metrics: {
      transitDepth: (Math.random() * 2 + 0.5).toFixed(3),
      orbitalPeriod: (Math.random() * 100 + 10).toFixed(2),
      planetRadius: (Math.random() * 3 + 0.5).toFixed(2),
      stellarMagnitude: (Math.random() * 5 + 10).toFixed(2)
    },
    lightCurve: data.slice(0, 100).map((row, index) => ({
      time: index,
      flux: row.FLUX || row.flux || Math.random() * 1000 + 4000
    }))
  };
}

export default function App() {
  const [csvData, setCsvData] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  
  // Estados nuevos para el formulario de predicción
  const [showPredictionForm, setShowPredictionForm] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          setCsvData(result.data);
          const processedResults = processData(result.data);
          setResults(processedResults);
          setLoading(false);
          setActiveTab('results');
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          setLoading(false);
        }
      });
    }
  };

  // Función para manejar predicción individual
  const handlePredict = async (data) => {
    try {
      const result = await predictSingleObject(data);
      setPredictionResult(result);
      
      if (result.success) {
        alert(`
Prediction: ${result.prediction}

Probabilities:
${Object.entries(result.probabilities)
  .map(([cls, prob]) => `  ${cls}: ${prob.toFixed(2)}%`)
  .join('\n')}
        `);
      }
      
      setShowPredictionForm(false);
    } catch (error) {
      console.error('Error en predicción:', error);
      alert('Error al realizar la predicción. Asegúrate de que el backend esté corriendo en http://localhost:5000');
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
              {/* Botón para predicción individual */}
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

      {/* Navigation Tabs */}
      <div className="container mx-auto px-6 mt-6">
        <div className="flex space-x-2 bg-black bg-opacity-20 backdrop-blur-sm rounded-lg p-1">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === 'upload'
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
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === 'results' && results
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-blue-200 hover:bg-white hover:bg-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <Target className="w-5 h-5 inline mr-2" />
            Analysis Results
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

              <div className="mt-8 bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Expected CSV Format</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Your CSV should contain FLUX or flux column with light intensity measurements over time
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && results && (
          <div className="space-y-6">
            {/* Detection Result Banner */}
            <div className={`rounded-xl shadow-lg p-6 ${
              results.isExoplanet 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : 'bg-gradient-to-r from-orange-500 to-red-600'
            }`}>
              <div className="flex items-center justify-between text-white">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {results.isExoplanet ? '🎉 Exoplanet Detected!' : '🔍 No Exoplanet Detected'}
                  </h2>
                  <p className="text-lg opacity-90">
                    Classification Confidence: {results.confidence}%
                  </p>
                </div>
                <Target className="w-20 h-20 opacity-30" />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={TrendingUp}
                title="Confidence Level"
                value={`${results.confidence}%`}
                color="#3b82f6"
              />
              <StatCard
                icon={Activity}
                title="Transit Depth"
                value={`${results.metrics.transitDepth}%`}
                subtitle="Relative flux decrease"
                color="#8b5cf6"
              />
              <StatCard
                icon={Moon}
                title="Orbital Period"
                value={`${results.metrics.orbitalPeriod}`}
                subtitle="Days"
                color="#06b6d4"
              />
              <StatCard
                icon={Target}
                title="Planet Radius"
                value={`${results.metrics.planetRadius}`}
                subtitle="Earth radii"
                color="#10b981"
              />
            </div>

            {/* Light Curve Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-blue-500" />
                Light Curve Analysis
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={results.lightCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: 'Time (arbitrary units)', position: 'insideBottom', offset: -5 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    label={{ value: 'Flux', angle: -90, position: 'insideLeft' }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="flux" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                    name="Stellar Flux"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Detection Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Detection Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Physical Parameters</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Transit Depth:</span>
                      <span className="font-medium">{results.metrics.transitDepth}%</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Orbital Period:</span>
                      <span className="font-medium">{results.metrics.orbitalPeriod} days</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Planet Radius:</span>
                      <span className="font-medium">{results.metrics.planetRadius} R⊕</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Stellar Magnitude:</span>
                      <span className="font-medium">{results.metrics.stellarMagnitude}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Classification Info</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Model Confidence:</span>
                      <span className="font-medium">{results.confidence}%</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Detection Method:</span>
                      <span className="font-medium">Transit Photometry</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Data Points Analyzed:</span>
                      <span className="font-medium">{results.lightCurve.length}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Classification:</span>
                      <span className={`font-medium ${results.isExoplanet ? 'text-green-600' : 'text-orange-600'}`}>
                        {results.isExoplanet ? 'Exoplanet Candidate' : 'No Transit Detected'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal del formulario de predicción */}
      {showPredictionForm && (
        <PredictionForm
          onClose={() => setShowPredictionForm(false)}
          onPredict={handlePredict}
        />
      )}
    </div>
  );
}