export const predictSingleObject = async (data) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Error en la predicción: ${response.status} ${errorBody}`);
    }

    const result = await response.json();
    
    // Estructura esperada del backend:
    // {
    //   "success": true,
    //   "prediction": "CONFIRMED",
    //   "probabilities": { "CANDIDATE": 12.3, "CONFIRMED": 87.7 },
    //   "llm_analysis": "Este es el análisis del modelo de lenguaje...",
    //   "features": {
    //     "planetRadius": 1.2,
    //     "orbitalPeriod": 45.6,
    //     "transitDepth": 0.8
    //   }
    // }
    
    return result;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener análisis LLM adicional
export const getLlmAnalysis = async (predictionData) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(predictionData),
    });

    if (!response.ok) {
      throw new Error(`Error en el análisis LLM: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en análisis LLM:', error);
    throw error;
  }
};

// Función para obtener datos de ejemplo
export const getSampleData = () => {
  return {
    koi_disposition: 'CONFIRMED',
    koi_period: 45.6,
    koi_impact: 0.8,
    koi_duration: 3.2,
    koi_depth: 0.0012,
    koi_prad: 1.2,
    koi_teq: 450,
    koi_slogg: 4.2,
    koi_srad: 0.9,
    koi_smass: 0.95,
    koi_kepmag: 12.5
  };
};

// Función para validar datos de entrada
export const validateInputData = (data) => {
  const requiredFields = [
    'koi_period', 'koi_impact', 'koi_duration', 
    'koi_depth', 'koi_prad', 'koi_teq'
  ];
  
  const missingFields = requiredFields.filter(field => 
    data[field] === undefined || data[field] === null || data[field] === ''
  );
  
  if (missingFields.length > 0) {
    throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
  }
  
  // Validaciones de rango
  const validations = {
    koi_period: { min: 0.1, max: 1000 },
    koi_impact: { min: 0, max: 1 },
    koi_duration: { min: 0.1, max: 100 },
    koi_depth: { min: 0, max: 1 },
    koi_prad: { min: 0.1, max: 50 },
    koi_teq: { min: 100, max: 3000 }
  };
  
  for (const [field, range] of Object.entries(validations)) {
    const value = parseFloat(data[field]);
    if (value < range.min || value > range.max) {
      throw new Error(`${field} debe estar entre ${range.min} y ${range.max}`);
    }
  }
  
  return true;
};
