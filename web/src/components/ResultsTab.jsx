    import React from 'react';
import { Target, TrendingUp, Activity, Moon } from 'lucide-react';
import StatCard from './StatCard';
import LightCurveChart from './LightCurveChart';

export default function ResultsTab({ results }) {
  return (
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

      {/* Light Curve Visualization */}
      <LightCurveChart data={results.lightCurve} />

      {/* Detailed Information */}
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
  );
}