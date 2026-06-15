import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes MUST be declared before we mount the Vite middleware
  app.post("/api/analyze-weather", async (req, res) => {
    try {
      const { data, city, timeframe, query } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API Key is not configured on the server. Please check your secrets." });
      }

      // Initialize the modern @google/genai SDK on the server side
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      let prompt = "";
      if (query) {
        prompt = `You are an expert Climatologist and Meteorological Scientist conducting intermediate-level weather pattern analysis.
The user has provided a custom query about the weather dataset of "${city}" during the timeframe "${timeframe}".

DATASET METRICS (JSON Format):
${JSON.stringify(data, null, 2)}

User's Climate Query:
"${query}"

Please answer with high scientific accuracy, professional tone, and clear bullet points or markdown tables. Use specific terms (e.g. advection, relative humidity thresholds, barometric gradient, diurnal temperature cycle, katabatic winds) as applicable to the data. Reference specific data values to prove your findings.`;
      } else {
        prompt = `You are an expert Climatologist and Meteorological Scientist conducting intermediate-level weather pattern analysis.
Analyze this structured meteorological dataset for "${city}" during the timeframe "${timeframe}".

DATASET METRICS (JSON Format):
${JSON.stringify(data, null, 2)}

Provide a beautiful, highly detailed climate study divided into typical publication sections. 
Use markdown headers, metric comparisons, and bullets:

### Climate Profile Classification
Provide a 1-sentence Koppen-Geiger classification and overview of the selected profile (e.g., tropical rainforest, ocean marine, subarctic/taiga, desert).

### 1. Thermal Characteristics
- Identify warming or cooling trends across the periods.
- Evaluate the thermal amplitude (Tmax - Tmin) and discuss daily or monthly thermal inertia.
- Highlight specific anomaly indicators when temperature surges or dips unexpectedly.

### 2. Barometric Dynamics & Wind Velocity Response
- Elaborate on pressure gradients shown.
- Directly discuss the correlation between drops in barometric pressure and spikes in wind velocity. Explain if this matches typical cyclonic development, low-pressure trough passage, or cold fronts.
- Cite specific data indices to build this argument.

### 3. Hydrological Profiling (Precipitation & Moisture)
- Detail the rainfall trends. Compare the wettest period vs dry spells.
- Explore humidity-temperature correlation: does humidity plummet during heatwaves, or build up towards deep convective monsoons?

### 4. Risk Factors & Recommendations
- Calculate or project general risks: urban heat islands, storm surge risk, flash floods, or drought probability.
- Provide actionable recommendations for agricultural cycles, urban infrastructure, or energy/heating configurations.

Keep the language articulate, precise, and highly educational for an intermediate geography or climate research audience.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini weather analysis error:", error);
      res.status(500).json({ error: error.message || "A server-side error occurred while analyzing the climate pattern." });
    }
  });

  // Mount Vite development server or serve built client-side SPA static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started and listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
