import os
import xgboost as xgb
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder

model = xgb.XGBClassifier()
model.load_model('exoplanet_model.json')

le = LabelEncoder()
le.classes_ = np.array(['CANDIDATE', 'CONFIRMED', 'FALSE POSITIVE'])

feature_cols = [
    'koi_period', 'koi_impact', 'koi_duration', 'koi_depth',
    'koi_prad', 'koi_teq', 'koi_insol', 'koi_model_snr',
    'koi_steff', 'koi_slogg', 'koi_srad', 'koi_kepmag',
    'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec'
]

def predict_exoplanet(data_dict: dict) -> dict:
    df_new = pd.DataFrame([data_dict])
    df_new = df_new[feature_cols]  # requiere que todas las columnas estén presentes

    pred = model.predict(df_new)[0]
    proba = model.predict_proba(df_new)[0]

    result = le.inverse_transform([pred])[0]

    return {
        "prediction": result,
        "probabilities": {cls: float(proba[i]) for i, cls in enumerate(le.classes_)}
    }