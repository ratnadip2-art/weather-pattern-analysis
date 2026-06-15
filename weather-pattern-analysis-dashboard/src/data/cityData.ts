/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CityProfile, WeatherDataPoint } from "../types";

export const CITY_PROFILES: CityProfile[] = [
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    climateType: "Af (Koppen: Tropical Rainforest Climate)",
    elevation: "15m above sea level",
    latitude: "1.3521° N",
    longitude: "103.8198° E",
    description: "Characterized by high humidity, constant convective showers, and uniform solar radiation. Monsoonal cycles dominate wind directions, and urban heat island (UHI) effects can provoke sudden thermal anomalies.",
    defaultTimeframe: "12-Month Climate Profile",
    dataset: [
      { period: "Jan", monthName: "January", avgTemp: 26.5, maxTemp: 30.5, minTemp: 23.9, precipitation: 252, humidity: 84, pressure: 1011, windSpeed: 15, windDirection: "NNE", anomalyFlag: true, anomalyName: "Northeast Monsoon Surge" },
      { period: "Feb", monthName: "February", avgTemp: 27.2, maxTemp: 31.5, minTemp: 24.3, precipitation: 112, humidity: 81, pressure: 1011, windSpeed: 16, windDirection: "NNE" },
      { period: "Mar", monthName: "March", avgTemp: 27.8, maxTemp: 32.0, minTemp: 24.6, precipitation: 171, humidity: 82, pressure: 1010, windSpeed: 11, windDirection: "NE" },
      { period: "Apr", monthName: "April", avgTemp: 28.2, maxTemp: 32.4, minTemp: 25.0, precipitation: 165, humidity: 83, pressure: 1009, windSpeed: 9, windDirection: "E" },
      { period: "May", monthName: "May", avgTemp: 28.5, maxTemp: 32.8, minTemp: 25.2, precipitation: 151, humidity: 82, pressure: 1009, windSpeed: 9, windDirection: "SSE" },
      { period: "Jun", monthName: "June", avgTemp: 28.3, maxTemp: 32.2, minTemp: 25.1, precipitation: 135, humidity: 81, pressure: 1010, windSpeed: 11, windDirection: "SSW" },
      { period: "Jul", monthName: "July", avgTemp: 29.8, maxTemp: 34.5, minTemp: 25.4, precipitation: 90, humidity: 74, pressure: 1009, windSpeed: 14, windDirection: "S", anomalyFlag: true, anomalyName: "Urban Heat Island (UHI) Spurt" },
      { period: "Aug", monthName: "August", avgTemp: 28.0, maxTemp: 31.8, minTemp: 24.8, precipitation: 144, humidity: 82, pressure: 1010, windSpeed: 12, windDirection: "SSE" },
      { period: "Sep", monthName: "September", avgTemp: 27.9, maxTemp: 31.6, minTemp: 24.7, precipitation: 150, humidity: 81, pressure: 1010, windSpeed: 10, windDirection: "SSE" },
      { period: "Oct", monthName: "October", avgTemp: 27.7, maxTemp: 31.8, minTemp: 24.6, precipitation: 194, humidity: 83, pressure: 1009, windSpeed: 8, windDirection: "E" },
      { period: "Nov", monthName: "November", avgTemp: 26.9, maxTemp: 31.0, minTemp: 24.1, precipitation: 256, humidity: 85, pressure: 1009, windSpeed: 7, windDirection: "N" },
      { period: "Dec", monthName: "December", avgTemp: 26.2, maxTemp: 29.8, minTemp: 23.6, precipitation: 331, humidity: 87, pressure: 1010, windSpeed: 14, windDirection: "NNE", anomalyFlag: true, anomalyName: "Convective Monsoon Wave" }
    ]
  },
  {
    id: "reykjavik",
    name: "Reykjavik",
    country: "Iceland",
    climateType: "Cfc (Koppen: Subpolar Oceanic Climate)",
    elevation: "8m above sea level",
    latitude: "64.1466° N",
    longitude: "21.9426° W",
    description: "A climate with highly volatile subpolar maritime pressure systems. Highly exposed to the Icelandic Low, manifesting in profound pressure depressions during winter months that induce stormy wind velocity responses.",
    defaultTimeframe: "12-Month Climate Profile",
    dataset: [
      { period: "Jan", monthName: "January", avgTemp: -0.5, maxTemp: 2.1, minTemp: -3.2, precipitation: 75, humidity: 81, pressure: 989, windSpeed: 38, windDirection: "ENE", anomalyFlag: true, anomalyName: "Icelandic Low Deep Depression" },
      { period: "Feb", monthName: "February", avgTemp: 0.4, maxTemp: 2.8, minTemp: -2.1, precipitation: 71, humidity: 81, pressure: 994, windSpeed: 32, windDirection: "E" },
      { period: "Mar", monthName: "March", avgTemp: 0.8, maxTemp: 3.5, minTemp: -1.9, precipitation: 80, humidity: 79, pressure: 998, windSpeed: 29, windDirection: "E" },
      { period: "Apr", monthName: "April", avgTemp: 3.1, maxTemp: 5.9, minTemp: 0.5, precipitation: 56, humidity: 76, pressure: 1004, windSpeed: 21, windDirection: "N" },
      { period: "May", monthName: "May", avgTemp: 6.5, maxTemp: 9.6, minTemp: 3.8, precipitation: 51, humidity: 73, pressure: 1009, windSpeed: 18, windDirection: "SSW" },
      { period: "Jun", monthName: "June", avgTemp: 9.3, maxTemp: 12.4, minTemp: 6.9, precipitation: 44, humidity: 74, pressure: 1011, windSpeed: 15, windDirection: "S" },
      { period: "Jul", monthName: "July", avgTemp: 11.2, maxTemp: 14.5, minTemp: 8.8, precipitation: 50, humidity: 77, pressure: 1010, windSpeed: 14, windDirection: "SSW" },
      { period: "Aug", monthName: "August", avgTemp: 10.8, maxTemp: 13.9, minTemp: 8.4, precipitation: 62, humidity: 79, pressure: 1008, windSpeed: 16, windDirection: "SSW" },
      { period: "Sep", monthName: "September", avgTemp: 7.9, maxTemp: 10.5, minTemp: 5.6, precipitation: 73, humidity: 80, pressure: 1003, windSpeed: 23, windDirection: "ENE" },
      { period: "Oct", monthName: "October", avgTemp: 4.1, maxTemp: 6.8, minTemp: 1.8, precipitation: 85, humidity: 82, pressure: 999, windSpeed: 28, windDirection: "E" },
      { period: "Nov", monthName: "November", avgTemp: 1.5, maxTemp: 4.2, minTemp: -1.1, precipitation: 79, humidity: 80, pressure: 996, windSpeed: 33, windDirection: "E" },
      { period: "Dec", monthName: "December", avgTemp: -0.9, maxTemp: 1.5, minTemp: -3.8, precipitation: 92, humidity: 82, pressure: 986, windSpeed: 42, windDirection: "ENE", anomalyFlag: true, anomalyName: "Arctic Gale Front" }
    ]
  },
  {
    id: "sahara",
    name: "Al-Hoggar Base, Sahara",
    country: "Algeria",
    climateType: "BWh (Koppen: Hyper-Arid Hot Desert Climate)",
    elevation: "850m above sea level",
    latitude: "22.7850° N",
    longitude: "5.5228° E",
    description: "Extremely high thermal amplitude with practically non-existent year-round rainfall and low humidity levels. However, late-summer convective spikes can generate anomalous flash thunderstorms.",
    defaultTimeframe: "12-Month Climate Profile",
    dataset: [
      { period: "Jan", monthName: "January", avgTemp: 12.4, maxTemp: 20.1, minTemp: 4.7, precipitation: 1, humidity: 22, pressure: 1018, windSpeed: 12, windDirection: "ENE" },
      { period: "Feb", monthName: "February", avgTemp: 14.8, maxTemp: 22.8, minTemp: 6.8, precipitation: 1, humidity: 19, pressure: 1016, windSpeed: 14, windDirection: "E" },
      { period: "Mar", monthName: "March", avgTemp: 19.1, maxTemp: 27.5, minTemp: 10.7, precipitation: 2, humidity: 16, pressure: 1013, windSpeed: 16, windDirection: "E" },
      { period: "Apr", monthName: "April", avgTemp: 23.5, maxTemp: 31.8, minTemp: 15.2, precipitation: 1, humidity: 14, pressure: 1011, windSpeed: 18, windDirection: "E" },
      { period: "May", monthName: "May", avgTemp: 28.2, maxTemp: 36.4, minTemp: 20.0, precipitation: 3, humidity: 13, pressure: 1009, windSpeed: 17, windDirection: "ENE" },
      { period: "Jun", monthName: "June", avgTemp: 33.1, maxTemp: 41.5, minTemp: 24.7, precipitation: 1, humidity: 11, pressure: 1007, windSpeed: 15, windDirection: "NE" },
      { period: "Jul", monthName: "July", avgTemp: 32.8, maxTemp: 41.0, minTemp: 24.6, precipitation: 3, humidity: 13, pressure: 1007, windSpeed: 12, windDirection: "N" },
      { period: "Aug", monthName: "August", avgTemp: 31.9, maxTemp: 39.8, minTemp: 24.0, precipitation: 8, humidity: 17, pressure: 1008, windSpeed: 11, windDirection: "ENE" },
      { period: "Sep", monthName: "September", avgTemp: 29.5, maxTemp: 37.2, minTemp: 21.8, precipitation: 35, humidity: 28, pressure: 1010, windSpeed: 21, windDirection: "S", anomalyFlag: true, anomalyName: "Sudden Sahara Pluvial Storm" },
      { period: "Oct", monthName: "October", avgTemp: 23.4, maxTemp: 31.0, minTemp: 15.8, precipitation: 4, humidity: 24, pressure: 1012, windSpeed: 14, windDirection: "E" },
      { period: "Nov", monthName: "November", avgTemp: 17.2, maxTemp: 24.8, minTemp: 9.6, precipitation: 2, humidity: 23, pressure: 1015, windSpeed: 12, windDirection: "ENE" },
      { period: "Dec", monthName: "December", avgTemp: 13.1, maxTemp: 20.6, minTemp: 5.6, precipitation: 1, humidity: 24, pressure: 1017, windSpeed: 11, windDirection: "NE" }
    ]
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    climateType: "Cfb (Koppen: Mild Temperate Maritime Climate)",
    elevation: "35m above sea level",
    latitude: "51.5074° N",
    longitude: "0.1278° W",
    description: "An classic oceanic/temperate climate zone with damp days, moderate winter lows, comfortable summers, and constant drizzle. Severe convective cells or winds are rare here but warming seasons show gradual thermal drifts.",
    defaultTimeframe: "12-Month Climate Profile",
    dataset: [
      { period: "Jan", monthName: "January", avgTemp: 5.2, maxTemp: 8.1, minTemp: 2.3, precipitation: 55, humidity: 88, pressure: 1015, windSpeed: 18, windDirection: "WSW" },
      { period: "Feb", monthName: "February", avgTemp: 5.5, maxTemp: 8.6, minTemp: 2.4, precipitation: 41, humidity: 85, pressure: 1014, windSpeed: 17, windDirection: "WSW" },
      { period: "Mar", monthName: "March", avgTemp: 7.9, maxTemp: 11.6, minTemp: 4.2, precipitation: 42, humidity: 80, pressure: 1013, windSpeed: 15, windDirection: "SW" },
      { period: "Apr", monthName: "April", avgTemp: 10.3, maxTemp: 14.8, minTemp: 5.8, precipitation: 44, humidity: 75, pressure: 1012, windSpeed: 14, windDirection: "SW" },
      { period: "May", monthName: "May", avgTemp: 13.8, maxTemp: 18.2, minTemp: 9.4, precipitation: 50, humidity: 72, pressure: 1013, windSpeed: 12, windDirection: "S" },
      { period: "Jun", monthName: "June", avgTemp: 16.9, maxTemp: 21.6, minTemp: 12.2, precipitation: 45, humidity: 71, pressure: 1014, windSpeed: 11, windDirection: "SW" },
      { period: "Jul", monthName: "July", avgTemp: 21.0, maxTemp: 27.5, minTemp: 14.5, precipitation: 38, humidity: 68, pressure: 1014, windSpeed: 10, windDirection: "S", anomalyFlag: true, anomalyName: "Heat Dome Extension" },
      { period: "Aug", monthName: "August", avgTemp: 18.8, maxTemp: 23.5, minTemp: 14.1, precipitation: 49, humidity: 72, pressure: 1014, windSpeed: 11, windDirection: "WSW" },
      { period: "Sep", monthName: "September", avgTemp: 15.9, maxTemp: 19.8, minTemp: 12.0, precipitation: 52, humidity: 78, pressure: 1015, windSpeed: 12, windDirection: "WSW" },
      { period: "Oct", monthName: "October", avgTemp: 12.1, maxTemp: 15.6, minTemp: 8.6, precipitation: 69, humidity: 84, pressure: 1013, windSpeed: 14, windDirection: "SW" },
      { period: "Nov", monthName: "November", avgTemp: 8.2, maxTemp: 11.2, minTemp: 5.2, precipitation: 64, humidity: 87, pressure: 1014, windSpeed: 16, windDirection: "WSW" },
      { period: "Dec", monthName: "December", avgTemp: 5.8, maxTemp: 8.8, minTemp: 2.8, precipitation: 58, humidity: 89, pressure: 1015, windSpeed: 19, windDirection: "WSW" }
    ]
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    climateType: "Cfa (Koppen: Humid Subtropical / Monsoon Climate)",
    elevation: "40m above sea level",
    latitude: "35.6762° N",
    longitude: "139.6503° E",
    description: "Exhibits distinct hot, wet summers governed by Pacific monsoons and cold dry winters. Rapid barometric fluctuations are common in late summer during typhoon seasons, generating high-velocity wind spikes and extreme hydrological surges.",
    defaultTimeframe: "12-Month Climate Profile",
    dataset: [
      { period: "Jan", monthName: "January", avgTemp: 5.4, maxTemp: 9.8, minTemp: 1.1, precipitation: 52, humidity: 52, pressure: 1019, windSpeed: 12, windDirection: "N" },
      { period: "Feb", monthName: "February", avgTemp: 6.1, maxTemp: 10.4, minTemp: 1.7, precipitation: 56, humidity: 53, pressure: 1018, windSpeed: 14, windDirection: "N" },
      { period: "Mar", monthName: "March", avgTemp: 9.4, maxTemp: 13.8, minTemp: 4.9, precipitation: 116, humidity: 56, pressure: 1015, windSpeed: 15, windDirection: "N" },
      { period: "Apr", monthName: "April", avgTemp: 14.6, maxTemp: 19.0, minTemp: 10.1, precipitation: 125, humidity: 62, pressure: 1012, windSpeed: 14, windDirection: "SSE" },
      { period: "May", monthName: "May", avgTemp: 18.9, maxTemp: 23.2, minTemp: 14.5, precipitation: 138, humidity: 69, pressure: 1010, windSpeed: 13, windDirection: "S" },
      { period: "Jun", monthName: "June", avgTemp: 22.1, maxTemp: 25.8, minTemp: 18.5, precipitation: 168, humidity: 75, pressure: 1008, windSpeed: 11, windDirection: "S", anomalyFlag: true, anomalyName: "Pluvial Tsuyu (Rainy Moon)" },
      { period: "Jul", monthName: "July", avgTemp: 25.8, maxTemp: 29.5, minTemp: 22.0, precipitation: 156, humidity: 77, pressure: 1008, windSpeed: 12, windDirection: "S" },
      { period: "Aug", monthName: "August", avgTemp: 27.4, maxTemp: 31.5, minTemp: 23.5, precipitation: 147, humidity: 73, pressure: 1009, windSpeed: 14, windDirection: "S" },
      { period: "Sep", monthName: "September", avgTemp: 23.8, maxTemp: 27.2, minTemp: 20.3, precipitation: 380, humidity: 78, pressure: 988, windSpeed: 52, windDirection: "SSE", anomalyFlag: true, anomalyName: "Typhoon Barometric Depress" },
      { period: "Oct", monthName: "October", avgTemp: 18.1, maxTemp: 21.8, minTemp: 14.3, precipitation: 185, humidity: 70, pressure: 1014, windSpeed: 15, windDirection: "N" },
      { period: "Nov", monthName: "November", avgTemp: 12.7, maxTemp: 16.5, minTemp: 8.8, precipitation: 92, humidity: 64, pressure: 1018, windSpeed: 12, windDirection: "N" },
      { period: "Dec", monthName: "December", avgTemp: 7.9, maxTemp: 12.2, minTemp: 3.5, precipitation: 44, humidity: 56, pressure: 1019, windSpeed: 11, windDirection: "N" }
    ]
  }
];

// Helper to calculate mathematical coefficients directly on the client side
export function calculateClimateIndicators(dataset: WeatherDataPoint[]): {
  thermalAmplitude: number;
  averagePrecipitation: number;
  correlationPressureWind: number;
  climateWarmingSlope: number;
  extremeDaysCount: number;
} {
  const temperatures = dataset.map(d => d.avgTemp);
  const maxTemps = dataset.map(d => d.maxTemp);
  const minTemps = dataset.map(d => d.minTemp);
  const precipitations = dataset.map(d => d.precipitation);
  const pressures = dataset.map(d => d.pressure);
  const windSpeeds = dataset.map(d => d.windSpeed);

  // 1. Thermal Amplitude (maximum value - minimum value)
  const highestTemp = Math.max(...maxTemps);
  const lowestTemp = Math.min(...minTemps);
  const thermalAmplitude = parseFloat((highestTemp - lowestTemp).toFixed(1));

  // 2. Average Monthly Precipitation
  const totalPrecip = precipitations.reduce((sum, p) => sum + p, 0);
  const averagePrecipitation = parseFloat((totalPrecip / dataset.length).toFixed(1));

  // 3. Correlation between Pressure and Wind Speed (Pearson Correlation r)
  const n = dataset.length;
  let sumP = 0, sumW = 0, sumPW = 0, sumP2 = 0, sumW2 = 0;
  for (let i = 0; i < n; i++) {
    sumP += pressures[i];
    sumW += windSpeeds[i];
    sumPW += pressures[i] * windSpeeds[i];
    sumP2 += pressures[i] * pressures[i];
    sumW2 += windSpeeds[i] * windSpeeds[i];
  }
  const numerator = n * sumPW - sumP * sumW;
  const denominator = Math.sqrt((n * sumP2 - sumP * sumP) * (n * sumW2 - sumW * sumW));
  const correlationPressureWind = denominator === 0 ? 0 : parseFloat((numerator / denominator).toFixed(3));

  // 4. Climate warming slope (simple linear regression slope of average temperatures over the serial index)
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    const x = i + 1; // monthly index 1...12
    const y = temperatures[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }
  const slopeNumerator = n * sumXY - sumX * sumY;
  const slopeDenominator = n * sumX2 - sumX * sumX;
  const climateWarmingSlope = parseFloat((slopeNumerator / slopeDenominator).toFixed(3));

  // 5. Extreme days / anomalies count
  const extremeDaysCount = dataset.filter(d => d.anomalyFlag).length;

  return {
    thermalAmplitude,
    averagePrecipitation,
    correlationPressureWind,
    climateWarmingSlope,
    extremeDaysCount,
  };
}
