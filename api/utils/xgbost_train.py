import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import xgboost as xgb
import matplotlib.pyplot as plt
import seaborn as sns

# Cargar datos
df = pd.read_csv('cumulative_2025.10.01_21.11.02.csv', comment='#')

# Preparar target: usar koi_pdisposition (Disposition Using Kepler Data)
df = df[df['koi_disposition'].notna()].copy()

# Seleccionar features relevantes
feature_cols = [
    'koi_period', 'koi_impact', 'koi_duration', 'koi_depth',
    'koi_prad', 'koi_teq', 'koi_insol', 'koi_model_snr',
    'koi_steff', 'koi_slogg', 'koi_srad', 'koi_kepmag',
    'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec'
]

# Crear dataset
X = df[feature_cols].copy()
y = df['koi_disposition'].copy()

# Manejar valores faltantes
X = X.fillna(X.median())

# Codificar target
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Split train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

# Verificar número de clases
n_classes = len(np.unique(y_encoded))
print(f"Número de clases: {n_classes}")
print(f"Clases: {le.classes_}")

# Crear y entrenar modelo XGBoost
if n_classes == 2:
    # Clasificación binaria
    model = xgb.XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        eval_metric='logloss',
        tree_method='hist',
        objective='binary:logistic'
    )
else:
    # Clasificación multiclase
    model = xgb.XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        eval_metric='mlogloss',
        tree_method='hist',
        objective='multi:softmax',
        num_class=n_classes
    )

print("Entrenando modelo XGBoost...")
model.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    verbose=50
)

# Predicciones
y_pred = model.predict(X_test)

# Métricas
print("\n=== RESULTADOS ===")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}\n")
print("Classification Report:")
print(classification_report(y_test, y_pred, target_names=le.classes_))

# Matriz de confusión
plt.figure(figsize=(8, 6))
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=le.classes_, yticklabels=le.classes_)
plt.title('Confusion Matrix')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.tight_layout()
plt.savefig('confusion_matrix.png')
print("\nMatriz de confusión guardada en 'confusion_matrix.png'")

# Feature importance
plt.figure(figsize=(10, 6))
xgb.plot_importance(model, max_num_features=15, importance_type='gain')
plt.title('Feature Importance')
plt.tight_layout()
plt.savefig('feature_importance.png')
print("Feature importance guardada en 'feature_importance.png'")

# Guardar modelo
model.save_model('exoplanet_xgboost_model.json')
print("\nModelo guardado en 'exoplanet_xgboost_model.json'")

# Función para predecir nuevos datos
def predict_exoplanet(data_dict):
    """
    Predice si un objeto es exoplaneta, candidato o falso positivo

    Args:
        data_dict: diccionario con las features

    Returns:
        predicción y probabilidades
    """
    df_new = pd.DataFrame([data_dict])
    df_new = df_new[feature_cols].fillna(X.median())

    pred = model.predict(df_new)[0]
    proba = model.predict_proba(df_new)[0]

    result = le.inverse_transform([pred])[0]

    print(f"\nPredicción: {result}")
    for i, cls in enumerate(le.classes_):
        print(f"  {cls}: {proba[i]*100:.2f}%")

    return result, proba

# Ejemplo de uso
example = {
    'koi_period': 9.488,
    'koi_impact': 0.146,
    'koi_duration': 2.9575,
    'koi_depth': 615.8,
    'koi_prad': 2.26,
    'koi_teq': 793.0,
    'koi_insol': 93.59,
    'koi_model_snr': 35.8,
    'koi_steff': 5455.0,
    'koi_slogg': 4.467,
    'koi_srad': 0.927,
    'koi_kepmag': 15.347,
    'koi_fpflag_nt': 0,
    'koi_fpflag_ss': 0,
    'koi_fpflag_co': 0,
    'koi_fpflag_ec': 0
}

print("\n=== EJEMPLO DE PREDICCIÓN ===")
predict_exoplanet(example)