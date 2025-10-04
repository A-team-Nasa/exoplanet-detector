import React from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

export default function UploadTab({ onDataProcessed, loading, setLoading }) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          onDataProcessed(result.data);
          setLoading(false);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          setLoading(false);
        }
      });
    }
  };

  return (
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
  );
}