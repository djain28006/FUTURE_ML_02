from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load model & scaler
model = joblib.load("models/final_xgboost_churn_model.pkl")
scaler = joblib.load("models/scaler.pkl")

FEATURES = [
    "Contract_period",
    "Age",
    "Lifetime",
    "Avg_class_frequency_current_month",
    "Avg_class_frequency_total",
    "Avg_additional_charges_total",
    "Group_visits",
    "Promo_friends"
]

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    try:
        features = np.array([[data[f] for f in FEATURES]])
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]

        response = {
            "prediction": "Likely to Churn 🚨" if prediction == 1 else "Will Stay 💪"
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
