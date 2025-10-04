import React from 'react';
import { Moon, Activity } from 'lucide-react';

export default function Header() {
  return (
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
          <div className="flex items-center space-x-2 bg-blue-500 bg-opacity-20 px-4 py-2 rounded-lg">
            <Activity className="w-5 h-5 text-green-400" />
            <span className="text-white text-sm font-medium">Model Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}