import React, { useState } from 'react';
import { Moon, Activity, Upload, Target, TrendingUp, AlertCircle, Brain, Globe } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';
import PredictionForm from './components/PredictionForm';
import ExoplanetVisualization from './components/ExoplanetVisualization';
import KidsMode from './components/KidsMode';
import { predictSingleObject as apiPredict } from './services/api';

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
  
  // Estado para Kids Mode
  const [isKidsMode, setIsKidsMode] = useState(false);

  // Función: tomar los datos CSV y mandar al backend
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

  // Predicción desde formulario (objeto individual)
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

  // Si está en modo Kids, mostrar solo ese componente
  if (isKidsMode) {
    return <KidsMode onExit={() => setIsKidsMode(false)} />;
  }

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
              {/* Botón Kids Mode */}
              <button 
                className="btn-kids-mode"
                onClick={() => setIsKidsMode(true)}
              >
                🎨 Kids Mode
              </button>
              
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
                    {results.prediction === 'CONFIRMED'
                      ? '🎉 Exoplanet Detected!'
                      : results.prediction === 'CANDIDATE'
                        ? '🛸 Candidate Exoplanet!'
                        : '🔍 No Exoplanet Detected'}
                  </h2>
                </div>
                <Target className="w-20 h-20 opacity-30" />
              </div>
            </div>

            {/* Probability Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-blue-500" />
                Classification Probabilities
              </h3>
              <div className="space-y-4">
                {Object.entries(results.probabilities).map(([label, prob]) => {
                  const percentage = (prob * 100).toFixed(2);
                  const isHighest = prob === Math.max(...Object.values(results.probabilities));
                  return (
                    <div key={label}>
                      <div className="flex justify-between mb-2">
                        <span className={`font-semibold ${isHighest ? 'text-blue-600' : 'text-gray-700'}`}>
                          {label}
                        </span>
                        <span className={`font-bold ${isHighest ? 'text-blue-600' : 'text-gray-600'}`}>
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${label === 'CONFIRMED' ? 'bg-green-500' :
                            label === 'CANDIDATE' ? 'bg-yellow-500' :
                              'bg-red-500'
                            } ${isHighest ? 'shadow-lg' : ''}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3D Exoplanet Visualization or Info Message */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-2 text-blue-500" />
                3D Exoplanet Visualization
              </h3>
              {results.prediction === 'CONFIRMED' ? (
                <ExoplanetVisualization features={results.features} />
              ) : (
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                  <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">
                    No Exoplanet Visualization Available
                  </h4>
                  <p className="text-gray-600">
                    The analysis did not confirm an exoplanet detection.
                    This could be a false positive or require additional verification.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && showAdvancedResults && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl shadow-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Brain className="w-10 h-10" />
                    <h2 className="text-3xl font-bold">AI-Powered Deep Analysis</h2>
                  </div>
                  <p className="text-blue-100 text-lg">
                    Advanced machine learning insights and astronomical interpretation
                  </p>
                </div>
              </div>
            </div>

            {/* Main Analysis Content */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Decorative Header */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b border-purple-100">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <span className="text-sm font-semibold text-purple-700 ml-2">LLM OUTPUT</span>
                </div>
              </div>

              {/* Analysis Content */}
              <div className="p-8">
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 border-2 border-purple-100 shadow-inner">
                  <div className="prose prose-lg max-w-none
                    prose-headings:text-purple-900 prose-headings:font-bold
                    prose-h1:text-3xl prose-h1:mb-4 prose-h1:border-b-2 prose-h1:border-purple-200 prose-h1:pb-2
                    prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3 prose-h2:text-indigo-800
                    prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2 prose-h3:text-blue-700
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                    prose-strong:text-purple-700 prose-strong:font-bold
                    prose-ul:my-4 prose-ul:space-y-2
                    prose-li:text-gray-700 prose-li:pl-2
                    prose-code:bg-purple-100 prose-code:text-purple-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                    prose-blockquote:border-l-4 prose-blockquote:border-purple-400 prose-blockquote:bg-purple-50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:italic
                    prose-table:border-collapse prose-table:w-full
                    prose-th:bg-purple-100 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:text-purple-900
                    prose-td:border prose-td:border-gray-200 prose-td:p-3 prose-td:text-gray-700
                  ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {llmAnalysis}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-purple-500" />
                      <span>Analysis generated by advanced AI model</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-purple-600">Model: GPT-4</span>
                      <span>•</span>
                      <span>Timestamp: {new Date().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Performance Metrics Section */}
            <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <TrendingUp className="w-8 h-8 mr-3" />
                  XGBoost Model Performance Metrics
                </h3>
                <p className="text-cyan-100 mt-1">Trained on 1,913 test samples with 200 iterations</p>
              </div>

              <div className="p-8">
                {/* Overall Accuracy */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-bold text-white">Overall Accuracy</h4>
                    <span className="text-4xl font-bold text-green-400">92.0%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg" style={{ width: '92%' }}></div>
                  </div>
                </div>

                {/* Per-Class Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* CANDIDATE */}
                  <div className="bg-slate-700 bg-opacity-50 rounded-lg p-6 border border-yellow-500 border-opacity-30">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-lg font-bold text-yellow-400">CANDIDATE</h5>
                      <span className="text-sm text-slate-300">396 samples</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">Precision</span>
                          <span className="text-white font-semibold">81%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: '81%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">Recall</span>
                          <span className="text-white font-semibold">81%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: '81%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">F1-Score</span>
                          <span className="text-white font-semibold">81%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: '81%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CONFIRMED */}
                  <div className="bg-slate-700 bg-opacity-50 rounded-lg p-6 border border-green-500 border-opacity-30">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-lg font-bold text-green-400">CONFIRMED</h5>
                      <span className="text-sm text-slate-300">549 samples</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">Precision</span>
                          <span className="text-white font-semibold">88%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="h-full bg-green-400 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">Recall</span>
                          <span className="text-white font-semibold">88%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="h-full bg-green-400 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">F1-Score</span>
                          <span className="text-white font-semibold">88%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="h-full bg-green-400 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FALSE POSITIVE */}
                  <div className="bg-slate-700 bg-opacity-50 rounded-lg p-6 border border-red-500 border-opacity-30">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-lg font-bold text-red-400">FALSE POSITIVE</h5>
                      <span className="text-sm text-slate-300">968 samples</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">Precision</span>
                          <span className="text-white font-semibold">99%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="h-full bg-red-400 rounded-full" style={{ width: '99%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">Recall</span>
                          <span className="text-white font-semibold">99%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="h-full bg-red-400 rounded-full" style={{ width: '99%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">F1-Score</span>
                          <span className="text-white font-semibold">99%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="h-full bg-red-400 rounded-full" style={{ width: '99%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-slate-700 bg-opacity-30 rounded-lg p-4 text-center">
                    <p className="text-slate-400 text-sm mb-1">Macro Avg</p>
                    <p className="text-2xl font-bold text-cyan-400">89%</p>
                  </div>
                  <div className="bg-slate-700 bg-opacity-30 rounded-lg p-4 text-center">
                    <p className="text-slate-400 text-sm mb-1">Weighted Avg</p>
                    <p className="text-2xl font-bold text-cyan-400">92%</p>
                  </div>
                  <div className="bg-slate-700 bg-opacity-30 rounded-lg p-4 text-center">
                    <p className="text-slate-400 text-sm mb-1">Total Classes</p>
                    <p className="text-2xl font-bold text-purple-400">3</p>
                  </div>
                  <div className="bg-slate-700 bg-opacity-30 rounded-lg p-4 text-center">
                    <p className="text-slate-400 text-sm mb-1">Iterations</p>
                    <p className="text-2xl font-bold text-purple-400">200</p>
                  </div>
                </div>

                {/* Training Progress */}
                <div className="mt-8 bg-slate-700 bg-opacity-30 rounded-lg p-6">
                  <h5 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-cyan-400" />
                    Training Loss Evolution
                  </h5>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex justify-between text-slate-300">
                      <span>Iteration [0]</span>
                      <span className="text-red-400">mlogloss: 0.99566</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Iteration [50]</span>
                      <span className="text-orange-400">mlogloss: 0.21656</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Iteration [100]</span>
                      <span className="text-yellow-400">mlogloss: 0.19643</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Iteration [150]</span>
                      <span className="text-green-400">mlogloss: 0.19581</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Iteration [199]</span>
                      <span className="text-cyan-400">mlogloss: 0.20110 ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Brain className="w-8 h-8 opacity-80" />
                  <span className="text-3xl font-bold">AI</span>
                </div>
                <h4 className="font-semibold text-lg mb-1">Neural Analysis</h4>
                <p className="text-purple-100 text-sm">Deep learning interpretation of astronomical data</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-8 h-8 opacity-80" />
                  <span className="text-3xl font-bold">{predictionResult?.prediction}</span>
                </div>
                <h4 className="font-semibold text-lg mb-1">Classification</h4>
                <p className="text-blue-100 text-sm">Final model prediction result</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 opacity-80" />
                  <span className="text-3xl font-bold">
                    {Object.keys(predictionResult?.probabilities || {}).length}
                  </span>
                </div>
                <h4 className="font-semibold text-lg mb-1">Classes Evaluated</h4>
                <p className="text-indigo-100 text-sm">Multi-class probability distribution</p>
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