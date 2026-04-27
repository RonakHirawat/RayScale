/**
 * Mock DGI (Daily Growth Index) calculator
 * In production, this would call a trained ML model via a backend API.
 * Formula approximates plant growth potential based on solar and weather inputs.
 */

/**
 * Calculate a mock DGI score from inputs.
 * @param {Object} inputs
 * @returns {number} DGI value between 0 and 1
 */
export function calculateDGI(inputs) {
  const {
    dni = 0,
    dhi = 0,
    kt = 0,
    temperature = 0,
    humidity = 0,
    windSpeed = 0,
    precipitation = 0,
  } = inputs;

  // Normalize each factor to 0–1 range
  // Optimal solar irradiance: DNI ~800, DHI ~300
  const solarScore = Math.min(1, (dni / 900 + dhi / 350 + kt) / 3);

  // Optimal temperature: 20–30 °C
  const tempScore = temperature >= 15 && temperature <= 35
    ? 1 - Math.abs(temperature - 25) / 20
    : temperature < 15
    ? Math.max(0, (temperature + 5) / 20)
    : Math.max(0, (45 - temperature) / 15);

  // Optimal humidity: 50–70%
  const humScore = humidity >= 30 && humidity <= 90
    ? 1 - Math.abs(humidity - 60) / 60
    : 0.1;

  // Wind speed: low wind is better (0–5 ideal, penalize above 15)
  const windScore = windSpeed <= 5 ? 1 : windSpeed <= 15 ? 1 - (windSpeed - 5) / 20 : 0.2;

  // Precipitation bonus (small rain helps)
  const rainScore = precipitation === 0 ? 0.5
    : precipitation <= 10 ? 0.8 + precipitation * 0.02
    : precipitation <= 30 ? 1.0
    : Math.max(0.2, 1 - (precipitation - 30) / 60);

  // Weighted average
  const dgi = (
    solarScore * 0.35 +
    tempScore * 0.25 +
    humScore * 0.15 +
    windScore * 0.1 +
    rainScore * 0.15
  );

  return Math.max(0, Math.min(1, parseFloat(dgi.toFixed(3))));
}

/**
 * Classify DGI into growth condition label and color.
 */
export function classifyDGI(dgi) {
  if (dgi >= 0.65) return { label: 'High', color: 'green', emoji: '🌿' };
  if (dgi >= 0.35) return { label: 'Moderate', color: 'yellow', emoji: '🌱' };
  return { label: 'Low', color: 'red', emoji: '🥀' };
}

/**
 * Get irrigation recommendation based on DGI and precipitation.
 */
export function getIrrigationRecommendation(dgi, precipitation) {
  if (dgi >= 0.65 && precipitation > 15) return { text: 'Reduce irrigation – good rainfall today', icon: '💧', urgency: 'low' };
  if (dgi >= 0.65) return { text: 'Normal irrigation schedule', icon: '💧', urgency: 'normal' };
  if (dgi >= 0.35 && precipitation > 5) return { text: 'Light irrigation – some rainfall detected', icon: '💦', urgency: 'normal' };
  if (dgi >= 0.35) return { text: 'Normal to increased irrigation recommended', icon: '💦', urgency: 'normal' };
  return { text: 'Increase irrigation – poor growth conditions', icon: '🚿', urgency: 'high' };
}

/**
 * Get crop recommendations based on DGI.
 */
export function getCropRecommendations(dgi) {
  if (dgi >= 0.65) {
    return {
      title: 'Excellent growing conditions',
      crops: [
        { name: 'Rice', icon: '🌾' },
        { name: 'Wheat', icon: '🌾' },
        { name: 'Maize', icon: '🌽' },
        { name: 'Sugarcane', icon: '🎋' },
        { name: 'Sunflower', icon: '🌻' },
      ],
      advice: 'Plant high-yield sun-loving crops. Conditions are optimal.',
    };
  }
  if (dgi >= 0.35) {
    return {
      title: 'Moderate growing conditions',
      crops: [
        { name: 'Tomatoes', icon: '🍅' },
        { name: 'Pulses', icon: '🫘' },
        { name: 'Lentils', icon: '🌿' },
        { name: 'Cabbage', icon: '🥬' },
        { name: 'Spinach', icon: '🥦' },
      ],
      advice: 'Vegetables and short-season crops perform well here.',
    };
  }
  return {
    title: 'Challenging growing conditions',
    crops: [
      { name: 'Shade crops', icon: '🌿' },
      { name: 'Mushrooms', icon: '🍄' },
      { name: 'Ginger', icon: '🌱' },
      { name: 'Turmeric', icon: '🌱' },
    ],
    advice: 'Focus on shade-tolerant crops. Consider greenhouses.',
  };
}
