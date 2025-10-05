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
    """
    {
  "success": true,
  "prediction": "CONFIRMED", 
  "probabilities": {
    "CANDIDATE": 2.38,
    "CONFIRMED": 97.56,
    "FALSE POSITIVE": 0.06
  },
  "features": {
    "koi_period": 9.488,
    "koi_duration": 2.9575,
    "koi_depth": 0.0021,
    "koi_impact": 0.146
  },
  "lightCurve": [
    { "time": 0.0, "flux": 1.002 },
    { "time": 0.1, "flux": 0.998 },
    { "time": 0.2, "flux": 0.997 }
  ],
  "llm_analysis": "The transit depth and duration strongly suggest the presence of an exoplanet..."
}

    """ 
    result["success"] = True
    result["llm_analysis"] = "The transit depth and duration strongly suggest the presence of an exoplanet..."
    result["lightCurve"] = [
        { "time": 0.0, "flux": 1.002 },
        { "time": 0.1, "flux": 0.998 },
        { "time": 0.2, "flux": 0.997 }
    ]
    result["features"] = data_dict
    return result