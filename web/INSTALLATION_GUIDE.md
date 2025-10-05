# Installation Guide for 3D Visualization Feature

## Required Dependencies

To use the new 3D visualization feature, you need to install Three.js:

### Option 1: Using npm (Recommended)
```bash
npm install three
```

### Option 2: If PowerShell execution policy blocks npm
1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Then run: `npm install three`

### Option 3: Manual Installation
If npm still doesn't work, you can manually add Three.js:

1. Download Three.js from: https://unpkg.com/three@0.158.0/build/three.module.js
2. Place it in `web/src/lib/three.module.js`
3. Update the import in `ExoplanetVisualization.jsx`:
```javascript
import * as THREE from '../lib/three.module.js';
```

## Features Added

### ✅ 3D Exoplanet Visualization
- Interactive 3D planet rendering using Three.js
- Dynamic planet properties based on exoplanet data
- Animated orbital motion
- Space environment with star field
- Real-time planet rotation

### ✅ LLM Analysis Integration
- AI-powered exoplanet analysis
- Classification probability visualization
- Enhanced scientific context
- Detailed physical property analysis

### ✅ Advanced Analysis Tab
- New "Advanced Analysis" tab in the navigation
- Side-by-side 3D visualization and LLM analysis
- Enhanced metrics display
- Scientific context information

## Usage

1. Click "🔭 Predict Single Object" button
2. Fill in the exoplanet parameters
3. Click "Predict" to get results
4. Navigate to "Advanced Analysis" tab to see:
   - 3D visualization of the exoplanet
   - AI-powered analysis
   - Detailed probability breakdown
   - Physical properties

## Backend Integration

The feature expects your backend to return:
```json
{
  "success": true,
  "prediction": "CONFIRMED",
  "probabilities": {
    "CANDIDATE": 12.3,
    "CONFIRMED": 87.7
  },
  "llm_analysis": "Detailed analysis text...",
  "features": {
    "koi_prad": 1.2,
    "koi_period": 45.6,
    "koi_depth": 0.0012
  }
}
```

## Fallback Support

If the backend is not available, the system will:
- Use local prediction models
- Show basic analysis text
- Display 3D visualization with available data
- Maintain full functionality

## Troubleshooting

### Three.js Not Loading
- Ensure Three.js is properly installed
- Check browser console for import errors
- Verify the import path in ExoplanetVisualization.jsx

### Backend Connection Issues
- The app will fallback to local predictions
- Check that backend is running on http://127.0.0.1:8000
- Verify CORS settings if needed

### Performance Issues
- The 3D visualization uses hardware acceleration
- Reduce animation complexity on slower devices
- Consider disabling orbital motion for better performance
