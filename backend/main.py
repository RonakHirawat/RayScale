"""
RayScale – Flask Backend
Trains a Keras neural network on RayScale1.csv at startup and
exposes a /predict endpoint for the React frontend.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Input

# ──────────────────────────────────────────────
# Initialize Flask + CORS
# ──────────────────────────────────────────────
app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173", "http://127.0.0.1:5173",
    "http://localhost:5174", "http://127.0.0.1:5174",
])

# ──────────────────────────────────────────────
# Train model once at startup
# ──────────────────────────────────────────────
FEATURES = [
    'ALLSKY_SFC_SW_DNI',
    'ALLSKY_SFC_SW_DIFF',
    'ALLSKY_KT',
    'T2M',
    'RH2M',
    'WS10M',
    'PRECTOTCORR'
]

def train_model():
    df = pd.read_csv("RayScale1.csv", skiprows=16)

    df.replace(-999, np.nan, inplace=True)
    df.dropna(inplace=True)

    # Create DGI target
    ghi_min = df['ALLSKY_SFC_SW_DWN'].min()
    ghi_max = df['ALLSKY_SFC_SW_DWN'].max()
    df['DGI'] = (df['ALLSKY_SFC_SW_DWN'] - ghi_min) / (ghi_max - ghi_min)
    df['DGI'] = df['DGI'] * (df['T2M'] / 30)

    X = df[FEATURES]
    y = df['DGI']

    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )

    model = Sequential([
        Input(shape=(X_train.shape[1],)),
        Dense(64, activation='relu'),
        Dense(32, activation='relu'),
        Dense(16, activation='relu'),
        Dense(1,  activation='linear')
    ])
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    model.fit(X_train, y_train, epochs=50, batch_size=16, verbose=0)

    print(f"Model trained. Input features: {FEATURES}")
    return model, scaler


model, scaler = train_model()


# ──────────────────────────────────────────────
# Helper
# ──────────────────────────────────────────────
def categorize_dgi(val: float) -> str:
    if val < 0.3:
        return "Low"
    elif val < 0.6:
        return "Moderate"
    return "High"


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────

@app.route('/')
def home():
    return jsonify({
        "service": "RayScale Flask API",
        "status":  "running",
        "model":   "Keras Neural Network",
        "features": FEATURES,
    })


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)

    try:
        input_data = np.array([[
            data['ALLSKY_SFC_SW_DNI'],
            data['ALLSKY_SFC_SW_DIFF'],
            data['ALLSKY_KT'],
            data['T2M'],
            data['RH2M'],
            data['WS10M'],
            data['PRECTOTCORR']
        ]])

        input_scaled = scaler.transform(input_data)
        prediction   = float(model.predict(input_scaled, verbose=0)[0][0])
        category     = categorize_dgi(prediction)

        return jsonify({
            "DGI":      round(prediction, 4),
            "Category": category,
        })

    except KeyError as e:
        return jsonify({"error": f"Missing field: {e}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ──────────────────────────────────────────────
# Run
# ──────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=True, port=5000)