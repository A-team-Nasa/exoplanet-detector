from langchain_groq import ChatGroq
from dotenv import load_dotenv
import pandas as pd
import os

load_dotenv()
df = pd.read_csv('cumulative_2025.10.01_21.11.02.csv')
model = ChatGroq(model="openai/gpt-oss-20b", api_key=os.getenv("GROQ_API_KEY"))

def get_explanation(koi_data: dict, model_xg_result: dict) -> str:
    # Preparar target: usar koi_pdisposition (Disposition Using Kepler Data)
    df2 = df[df['koi_disposition'].notna()].copy()

    # Seleccionar features relevantes
    feature_cols = [
        'koi_period', 'koi_impact', 'koi_duration', 'koi_depth',
        'koi_prad', 'koi_teq', 'koi_insol', 'koi_model_snr',
        'koi_steff', 'koi_slogg', 'koi_srad', 'koi_kepmag',
        'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec'
    ]

    # Toma 10 filas aleatorias
    df_sample = df2[feature_cols].sample(n=10, random_state=42)

    prompt = f"""
    Eres un experto en astronomía y exoplanetas. Has recibido los siguientes datos de un objeto de interés planetario (KOI):

    {koi_data}

    Además, has utilizado un modelo de machine learning que ha clasificado este KOI como '{model_xg_result["prediction"]}' con las siguientes probabilidades:
    {model_xg_result["probabilities"]}

    Por favor, proporciona una explicación detallada y comprensible para un público general sobre por qué el modelo podría haber hecho esta clasificación, basándote en los datos proporcionados. Incluye posibles características del KOI que podrían haber influido en la decisión del modelo.

    Puedes tomar como referencia los siguientes ejemplos de KOIs con sus características:
    {df_sample.to_dict(orient='records')}
    """

    # response = model.invoke(prompt)
    # return response.content
    return "The transit depth and duration strongly suggest the presence of an exoplanet..."