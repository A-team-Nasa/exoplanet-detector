import pandas as pd
import requests

# URL de tu API
url = "http://127.0.0.1:8000/predict"

# Cargar el CSV (el dataset KOI)
df = pd.read_csv("cumulative_2025.10.01_21.11.02.csv")

# Columnas que tu modelo necesita
feature_cols = [
    'koi_period', 'koi_impact', 'koi_duration', 'koi_depth',
    'koi_prad', 'koi_teq', 'koi_insol', 'koi_model_snr',
    'koi_steff', 'koi_slogg', 'koi_srad', 'koi_kepmag',
    'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec'
]

# Tomar 10 ejemplos aleatorios (sin NaN en features)
samples = df.dropna(subset=feature_cols).sample(100, random_state=42)

# Métricas
total = 0
correct = 0

for i, row in samples.iterrows():
    # Convertir a dict solo con las columnas necesarias
    example_data = row[feature_cols].to_dict()

    # Enviar al endpoint
    response = requests.post(url, json=example_data)

    print("\n==== Ejemplo", i, "====")
    print("Input:", example_data)
    print("Etiqueta real:", row["koi_disposition"])

    if response.status_code == 200:
        pred = response.json()["prediction"]
        print("Predicción modelo:", pred)

        # Comparación
        if pred['prediction'] == row["koi_disposition"]:
            print("✅ Correcto")
            correct += 1
        else:
            print("❌ Incorrecto")
    else:
        print("Error en el endpoint:", response.text)

    total += 1

# Resumen de precisión
print("\n====================")
print(f"Total ejemplos: {total}")
print(f"Aciertos: {correct}")
print(f"Precisión: {correct/total:.2%}")
