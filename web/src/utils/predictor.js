// src/utils/predictor.js

/**
 * Función para realizar predicción de un objeto individual
 * Nota: Esta es la parte del frontend. Necesitarás un backend (API) 
 * que cargue el modelo XGBoost y realice la predicción real.
 */

export const predictSingleObject = async (data) => {
  // Aquí deberías hacer una llamada a tu API backend
  // que tenga el modelo XGBoost cargado
  
  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error en la predicción');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Medianas para valores faltantes (copia estos valores de tu entrenamiento)
export const FEATURE_MEDIANS = {
  koi_period: 10.0,  // Reemplaza con tus medianas reales
  koi_impact: 0.5,
  koi_duration: 3.0,
  koi_depth: 500.0,
  koi_prad: 2.0,
  koi_teq: 700.0,
  koi_insol: 50.0,
  koi_model_snr: 30.0,
  koi_steff: 5500.0,
  koi_slogg: 4.4,
  koi_srad: 1.0,
  koi_kepmag: 14.0,
  koi_fpflag_nt: 0,
  koi_fpflag_ss: 0,
  koi_fpflag_co: 0,
  koi_fpflag_ec: 0
};

export const FEATURE_COLS = [
  'koi_period', 'koi_impact', 'koi_duration', 'koi_depth',
  'koi_prad', 'koi_teq', 'koi_insol', 'koi_model_snr',
  'koi_steff', 'koi_slogg', 'koi_srad', 'koi_kepmag',
  'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec'
];