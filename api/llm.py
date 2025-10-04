# llm.py
import xgboost as xgb
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder

# Cargar el modelo
model = xgb.XGBClassifier()
model.load_model('exoplanet_xgboost_model.json')

# Recrear el LabelEncoder
le = LabelEncoder()
le.classes_ = np.array(['CANDIDATE', 'CONFIRMED', 'FALSE POSITIVE'])

# Cargar datos originales solo si quieres recalcular el LabelEncoder y medianas
df = pd.read_csv('cumulative_2025.10.01_21.11.02.csv', comment='#')
df = df[df['koi_disposition'].notna()]
le.fit(df['koi_disposition'])

# Features y medianas
feature_cols = [
    'koi_period', 'koi_impact', 'koi_duration', 'koi_depth',
    'koi_prad', 'koi_teq', 'koi_insol', 'koi_model_snr',
    'koi_steff', 'koi_slogg', 'koi_srad', 'koi_kepmag',
    'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec'
]
medians = df[feature_cols].median()

# Función de predicción
def predict_exoplanet(data_dict):
    df_new = pd.DataFrame([data_dict])
    df_new = df_new[feature_cols].fillna(medians)
    
    pred = model.predict(df_new)[0]
    proba = model.predict_proba(df_new)[0]
    
    result = le.inverse_transform([pred])[0]
    
    # Retornar diccionario listo para JSON
    return {
        "prediction": result,
        "probabilities": {cls: float(proba[i]) for i, cls in enumerate(le.classes_)}
    }
