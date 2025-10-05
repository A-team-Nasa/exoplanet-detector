from langchain_groq import ChatGroq
from dotenv import load_dotenv
import pandas as pd
import os

load_dotenv()
df = pd.read_csv('cumulative_2025.10.01_21.11.02.csv')
model = ChatGroq(model="openai/gpt-oss-20b", api_key=os.getenv("GROQ_API_KEY"))

def get_explanation(koi_data: dict, model_xg_result: dict) -> str:
    # Prepare target: use koi_pdisposition (Disposition Using Kepler Data)
    df2 = df[df['koi_disposition'].notna()].copy()

    # Select relevant features
    feature_cols = [
        'koi_period', 'koi_impact', 'koi_duration', 'koi_depth',
        'koi_prad', 'koi_teq', 'koi_insol', 'koi_model_snr',
        'koi_steff', 'koi_slogg', 'koi_srad', 'koi_kepmag',
        'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec'
    ]

    # Take 10 random rows
    df_sample = df2[feature_cols].sample(n=10, random_state=42)

    prompt = f"""
    You are an expert in astronomy and exoplanets. You have received the following data for a Kepler Object of Interest (KOI):

    {koi_data}

    Additionally, you used a machine learning model that classified this KOI as '{model_xg_result["prediction"]}' with the following probabilities:
    {model_xg_result["probabilities"]}

    Please provide a detailed and easy-to-understand explanation for a general audience about why the model might have made this classification, based on the provided data. Include possible KOI features that could have influenced the model's decision.

    You can reference the following examples of KOIs with their characteristics:
    {df_sample.to_dict(orient='records')}
    """

    response = model.invoke(prompt)
    return response.content
    # return "The transit depth and duration strongly suggest the presence of an exoplanet..."
