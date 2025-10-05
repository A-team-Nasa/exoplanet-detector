# Exoplanet Detection System - NASA Space Apps Challenge 2025

*Exoplanet Detection System* es una plataforma integral de inteligencia artificial diseñada para analizar datos de Kepler Objects of Interest (KOI) y clasificar potenciales exoplanetas. Utilizando un potente modelo de Machine Learning (XGBoost) y un Large Language Model (LLM) para la interpretación de resultados, esta herramienta permite tanto a investigadores como a entusiastas de la astronomía identificar y entender los descubrimientos de la misión Kepler.

El sistema clasifica cada KOI en una de tres categorías:
*   🪐 *CONFIRMED*: El objeto es un exoplaneta confirmado.
*   ✨ *CANDIDATE*: El objeto tiene un alto potencial de ser un exoplaneta y requiere más análisis.
*   🚫 *FALSE POSITIVE*: El objeto probablemente no es un exoplaneta (ej. ruido estelar, estrella binaria eclipsante).

##  Demo de la Interfaz

 <!-- Reemplaza con una captura de pantalla de tu UI -->

---

## 🏛️ Arquitectura del Sistema

El proyecto está construido sobre una arquitectura moderna de microservicios que separa la lógica del frontend, el backend y los modelos de IA, garantizando escalabilidad y mantenibilidad.

1.  *Frontend (React)*:
    *   Una interfaz de usuario web interactiva y responsiva construida con React y estilizada con Tailwind CSS.
    *   Permite a los usuarios cargar archivos CSV con datos de KOI o ingresar manualmente los parámetros de un solo objeto.
    *   Visualiza los resultados, incluyendo una representación 3D comparativa del exoplaneta, su estrella anfitriona y la Tierra, creada con Three.js.
    *   Muestra un análisis detallado generado por un LLM.

2.  *Backend (FastAPI)*:
    *   Una API de alto rendimiento construida con FastAPI (Python) que sirve como el cerebro del sistema.
    *   Expone un endpoint /predict que recibe los datos del KOI.
    *   Orquesta las llamadas al modelo de Machine Learning y al servicio de LLM.

3.  *Modelo de Machine Learning (XGBoost)*:
    *   Un modelo XGBoost pre-entrenado (exoplanet_model.json) que realiza la clasificación principal.
    *   Fue entrenado con el [dataset acumulativo de KOIs de la NASA](https://exoplanetarchive.ipac.caltech.edu/docs/data.html).
    *   Analiza 16 características clave para determinar la probabilidad de cada clasificación.

4.  *Análisis por LLM (ChatGroq)*:
    *   Integrado a través del backend, este servicio recibe los datos de entrada y el resultado del modelo XGBoost.
    *   Genera una explicación detallada y en lenguaje natural sobre por qué el modelo tomó esa decisión, haciendo los resultados accesibles para un público más amplio.

 <!-- Reemplaza con tu diagrama de arquitectura -->

---

## ✨ Características Principales

*   *Doble Modo de Entrada*:
    1.  *Carga por Lote (CSV)*: Analiza un archivo CSV completo con múltiples KOIs.
    2.  *Predicción Única*: Permite ingresar manualmente 16 parámetros de un objeto para un análisis instantáneo.
*   *Dashboard de Resultados Analíticos*:
    *   Muestra la clasificación final (CONFIRMED, CANDIDATE, FALSE POSITIVE) y las probabilidades asociadas.
    *   Incluye una visualización 3D interactiva para comparar el tamaño del exoplaneta, su estrella y la Tierra.
*   *Análisis Avanzado con IA*:
    *   La pestaña "Advanced Analysis" ofrece una explicación generada por un LLM, que interpreta las características del KOI y justifica el resultado del modelo.
*   *Modelo de Alta Precisión*: El modelo XGBoost subyacente fue entrenado y evaluado para ofrecer resultados confiables.

---

## 🤖 El Modelo de Machine Learning

El núcleo de la plataforma es un clasificador XGBoost entrenado para distinguir entre exoplanetas confirmados, candidatos y falsos positivos.

### Features Utilizadas

El modelo fue entrenado utilizando las siguientes 16 características:

1.  koi_period: Periodo Orbital (días)
2.  koi_impact: Parámetro de Impacto
3.  koi_duration: Duración del Tránsito (horas)
4.  koi_depth: Profundidad del Tránsito (ppm)
5.  koi_prad: Radio Planetario (radios terrestres)
6.  koi_teq: Temperatura de Equilibrio (K)
7.  koi_insol: Flujo de Insolación (flujo terrestre)
8.  koi_model_snr: Señal-Ruido del Tránsito
9.  koi_steff: Temperatura Efectiva Estelar (K)
10. koi_slogg: Gravedad Superficial Estelar (log10)
11. koi_srad: Radio Estelar (radios solares)
12. koi_kepmag: Magnitud Kepler
13. koi_fpflag_nt: Bandera de "No Similar a Tránsito" (0 o 1)
14. koi_fpflag_ss: Bandera de Eclipse Estelar (0 o 1)
15. koi_fpflag_co: Bandera de Desplazamiento del Centroide (0 o 1)
16. koi_fpflag_ec: Bandera de Coincidencia de Efemérides (0 o 1)

### Métricas de Rendimiento

El modelo ha demostrado un rendimiento sólido en el conjunto de datos de prueba:

*   *Accuracy General: **90.72%*

#### Reporte de Clasificación:
| Clase          | Precision | Recall | F1-Score | Support |
|----------------|-----------|--------|----------|---------|
| CANDIDATE      | 0.76      | 0.65   | 0.70     | 176     |
| CONFIRMED      | 0.89      | 0.93   | 0.91     | 520     |
| FALSE POSITIVE | 0.99      | 0.99   | 0.99     | 382     |
| *Weighted Avg*   | *0.90*      | *0.91*   | *0.90*     | *1078*    |

(Los gráficos de la Matriz de Confusión y la Importancia de las Características se generan durante el entrenamiento en confusion_matrix.png y feature_importance.png)

---

## 🛠️ Stack Tecnológico

*   *Frontend*: React, Tailwind CSS, Three.js, Recharts, PapaParse
*   *Backend*: Python, FastAPI
*   *Machine Learning*: XGBoost, Pandas, Scikit-learn
*   *LLM*: Groq API (ChatGroq)

---

## 🚀 Guía de Instalación y Uso

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

### Prerrequisitos

*   Python 3.8+
*   Node.js v16+ y npm/yarn
*   Una clave de API de Groq

### 1. Configuración del Backend

bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio

# 2. Crea y activa un entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# 3. Instala las dependencias de Python
pip install -r requirements.txt  # Asegúrate de tener un archivo requirements.txt

# 4. Configura las variables de entorno
# Crea un archivo llamado .env en la raíz del proyecto y añade tu clave de API:
# GROQ_API_KEY="tu_clave_secreta_de_groq"

# 5. Inicia el servidor FastAPI
uvicorn main:app --reload

El backend ahora estará corriendo en http://127.0.0.1:8000.

### 2. Configuración del Frontend

bash
# 1. Navega al directorio del frontend (asumiendo que está en una carpeta 'frontend' o similar)
cd frontend/

# 2. Instala las dependencias de Node.js
npm install

# 3. Inicia la aplicación de React
npm start

La interfaz de usuario ahora estará accesible en http://localhost:3000.

### 3. (Opcional) Re-entrenar el Modelo

Si deseas re-entrenar el modelo con un dataset actualizado:
1.  Coloca el nuevo archivo CSV (ej. cumulative_new.csv) en la raíz del proyecto.
2.  Modifica la ruta del archivo en xgbost_train.py si es necesario.
3.  Ejecuta el script de entrenamiento:
    bash
    python xgbost_train.py
    
Esto generará un nuevo archivo exoplanet_xgboost_model.json y los gráficos de métricas.

---

## 📂 Estructura del Proyecto


.
├── frontend/                 # Directorio de la aplicación React
│   ├── src/
│   │   ├── components/       # Componentes de React (Formulario, Gráficos, 3D)
│   │   ├── services/         # Lógica de la API (api.js)
│   │   └── App.jsx           # Componente principal de la aplicación
│   └── ...
├── backend/                  # Directorio de la aplicación FastAPI
│   ├── main.py               # Lógica principal de la API y endpoint /predict
│   ├── model_xg.py           # Funciones para cargar el modelo y predecir
│   ├── llm_connection.py     # Conexión con la API de Groq para explicaciones
│   ├── xgbost_train.py       # Script para entrenar el modelo XGBoost
│   ├── exoplanet_model.json  # El modelo de IA entrenado
│   └── ...
└── README.md                 # Este archivo
