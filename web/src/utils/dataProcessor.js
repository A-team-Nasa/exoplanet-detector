export function processData(data) {
  // Aquí conectarás tu modelo de IA real
  // Por ahora, simulación para propósitos de demo
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