import React, { useState } from 'react';
import '../index.css';

const PredictionForm = ({ onClose, onPredict }) => {
  const [formData, setFormData] = useState({
    koi_period: '',
    koi_impact: '',
    koi_duration: '',
    koi_depth: '',
    koi_prad: '',
    koi_teq: '',
    koi_insol: '',
    koi_model_snr: '',
    koi_steff: '',
    koi_slogg: '',
    koi_srad: '',
    koi_kepmag: '',
    koi_fpflag_nt: '0',
    koi_fpflag_ss: '0',
    koi_fpflag_co: '0',
    koi_fpflag_ec: '0'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fieldLabels = {
    koi_period: 'Orbital Period (days)',
    koi_impact: 'Impact Parameter',
    koi_duration: 'Transit Duration (hours)',
    koi_depth: 'Transit Depth (ppm)',
    koi_prad: 'Planetary Radius (Earth radii)',
    koi_teq: 'Equilibrium Temperature (K)',
    koi_insol: 'Insolation Flux (Earth flux)',
    koi_model_snr: 'Transit Signal-to-Noise',
    koi_steff: 'Stellar Effective Temperature (K)',
    koi_slogg: 'Stellar Surface Gravity (log10)',
    koi_srad: 'Stellar Radius (Solar radii)',
    koi_kepmag: 'Kepler Magnitude',
    koi_fpflag_nt: 'Not Transit-Like Flag (0 or 1)',
    koi_fpflag_ss: 'Stellar Eclipse Flag (0 or 1)',
    koi_fpflag_co: 'Centroid Offset Flag (0 or 1)',
    koi_fpflag_ec: 'Ephemeris Match Flag (0 or 1)'
  };

  // Lista de KOIs de ejemplo
const exampleKOIs = [
  // CONFIRMED: Kepler-227 b
  {
    koi_period: '9.488',
    koi_impact: '0.146',
    koi_duration: '2.9575',
    koi_depth: '615.8',
    koi_prad: '2.26',
    koi_teq: '793.0',
    koi_insol: '93.59',
    koi_model_snr: '35.8',
    koi_steff: '5455.0',
    koi_slogg: '4.467',
    koi_srad: '0.927',
    koi_kepmag: '15.347',
    koi_fpflag_nt: '0',
    koi_fpflag_ss: '0',
    koi_fpflag_co: '0',
    koi_fpflag_ec: '0'
  },

];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const numericData = {};
    for (const key in formData) {
      const value = formData[key];
      numericData[key] = value === '' ? null : parseFloat(value);
    }

    try {
      await onPredict(numericData);
    } catch (error) {
      console.error('Error en predicción:', error);
      alert('Error al realizar la predicción. Verifica los datos ingresados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadExample = () => {
    // Escoger un KOI al azar
    const randomKOI = exampleKOIs[Math.floor(Math.random() * exampleKOIs.length)];
    setFormData(randomKOI);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Single Object Prediction</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="form-actions-top">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleLoadExample}
            >
              Load Random Example
            </button>
          </div>

          <div className="form-grid">
            {Object.keys(formData).map((fieldName) => (
              <div key={fieldName} className="form-field">
                <label htmlFor={fieldName}>
                  {fieldLabels[fieldName]}
                </label>
                <input
                  type="number"
                  id={fieldName}
                  name={fieldName}
                  value={formData[fieldName]}
                  onChange={handleChange}
                  step="any"
                  placeholder={fieldName.includes('flag') ? '0 or 1' : 'Enter value'}
                />
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-send"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'SEND'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PredictionForm;
