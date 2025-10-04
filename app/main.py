from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="API KOI",
    version="1.0.0",
    description="API para generar predicciones"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def predict():
    return "Esta es una predicción basada en los datos proporcionados."

@app.get("/predict")
def comunicate():
    return {"message": f"Predicción generada: {predict()}"}
