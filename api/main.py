from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llm import predict_exoplanet

app = FastAPI(
    title="API KOI",
    version="1.0.0",
    description="API para generar predicciones de exoplanetas"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExoplanetData(BaseModel):
    koi_period: float
    koi_impact: float
    koi_duration: float
    koi_depth: float
    koi_prad: float
    koi_teq: float
    koi_insol: float
    koi_model_snr: float
    koi_steff: float
    koi_slogg: float
    koi_srad: float
    koi_kepmag: float
    koi_fpflag_nt: int
    koi_fpflag_ss: int
    koi_fpflag_co: int
    koi_fpflag_ec: int

# Endpoint POST para predicción
@app.post("/predict")
def predict_endpoint(data: ExoplanetData):
    data_dict = data.dict()
    result = predict_exoplanet(data_dict)
    return {
        "prediction": result,
    }