/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WeatherDataPoint {
  period: string; // e.g., "Jan", "Feb", etc. or "Year 1", "Year 2"
  monthName: string; // Full month name or standard period text
  avgTemp: number; // in Celsius
  maxTemp: number; // in Celsius
  minTemp: number; // in Celsius
  precipitation: number; // in mm
  humidity: number; // in percentage (0-100)
  pressure: number; // in hPa (millibars, normal ~1013 hPa)
  windSpeed: number; // in km/h
  windDirection: string; // e.g., "NNE", "WSW"
  anomalyFlag?: boolean;
  anomalyName?: string; // e.g., "Monsoon Surge", "Barometric Drop", "Thermal Anomaly"
}

export interface CityProfile {
  id: string;
  name: string;
  country: string;
  climateType: string; // e.g., "Af (Tropical)", "Cfb (Maritme)", "Ddf (Subarctic)", "BWh (Desert)"
  elevation: string; // e.g., "15m", "220m"
  latitude: string;
  longitude: string;
  description: string;
  defaultTimeframe: string;
  dataset: WeatherDataPoint[];
}

export interface ClimatePatternMetrics {
  thermalAmplitude: number; // highest maxTemp - lowest minTemp
  averagePrecipitation: number; // total precipitation / periodCount
  correlationPressureWind: number; // Pearson correlation coefficient or simple indicator description
  climateWarmingSlope: number; // slope of temperatures
  extremeDaysCount: number; // count of records with anomaly flags
}
