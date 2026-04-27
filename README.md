# 🌱 RayScale – Smart Agriculture Intelligence

A full-stack smart agriculture system that predicts the **Daily Growth Index (DGI)** using solar and environmental parameters, and provides irrigation + crop recommendations.

---

## 📁 Project Structure

```
Ray/
├── backend/                   ← Python FastAPI server (your ML model)
│   ├── main.py                ← API server
│   ├── requirements.txt       ← Python dependencies
│   ├── model.pkl              ← ⚠️ YOU DROP THIS HERE
│   ├── model_config.json      ← ⚠️ YOU DROP THIS HERE
│   └── model_config.example.json  ← Example config format
│
└── rayscale-frontend/         ← React + Tailwind CSS UI
    ├── src/
    │   ├── App.jsx            ← Main app (calls backend API)
    │   ├── components/        ← UI components
    │   └── utils/
    │       ├── dgiCalculator.js   ← Fallback mock (used when backend is offline)
    │       └── weatherApi.js      ← OpenWeatherMap integration
    └── .env.example           ← Frontend env config
```

---

## 🚀 Quick Start

### Step 1 – Set up Backend

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Drop your model files here:
#   backend/model.pkl           ← your trained model
#   backend/model_config.json   ← your feature config (see model_config.example.json)

# Start the API server
uvicorn main:app --reload
# → Runs at http://localhost:8000
# → API docs at http://localhost:8000/docs
```

### Step 2 – Set up Frontend

```bash
cd rayscale-frontend

# Copy env file
cp .env.example .env

# Start dev server
npm run dev
# → Runs at http://localhost:5173
```

---

## 📋 model_config.json Format

This tells the backend what features your model expects (and in what order):

```json
{
  "feature_names": ["DNI", "DHI", "KT", "Temperature", "Humidity", "WindSpeed", "Precipitation"],
  "target": "DGI",
  "training_info": {
    "algorithm": "RandomForestRegressor",
    "r2_score": 0.92
  }
}
```

> ⚠️ **`feature_names` must exactly match your training column names, in the same order.**

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Service info |
| GET | `/health` | Backend health check |
| POST | `/predict` | Run DGI prediction |
| GET | `/model-info` | Model metadata |
| GET | `/docs` | Interactive Swagger UI |

---

## 🧠 How Prediction Works

```
User Input (React UI)
        ↓
  POST /predict
        ↓
  Load model.pkl + model_config.json
        ↓
  Build feature array (in training order)
        ↓
  model.predict(X)  ← your actual ML model
        ↓
  Return DGI (0–1) + label + recommendations
        ↓
  Display in dashboard
```

If the backend is offline, the UI **automatically falls back** to a mock mathematical formula so the UI always works during development.
