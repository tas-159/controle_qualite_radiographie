from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import app.models as models
from app.calculators.test1_exactitude import calculer_exactitude_kv
from app.calculators.test2_reproductibilite import calculer_reproductibilite_kv
from app.calculators.test5_cda import calculer_cda
from app.calculators.test3_linearite import calculer_linearite_mas
from app.calculators.test4_temps import calculer_temps_exposition

app = FastAPI(title="🏥 Contrôle Qualité Radiographie - Tunisie")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "✅ API Backend OK - Tunisie"}

@app.post("/api/test1")
async def test1(data: models.Test1ExactitudeKV):
    return calculer_exactitude_kv(data)

@app.post("/api/test2")
async def test2(data: models.Test2ReproductibiliteKV):
    return calculer_reproductibilite_kv(data)

@app.post("/api/calculer")
async def calculer(tests: dict):
    resultats: list[models.ResultatTest] = []

    # Test 1
    if "test1" in tests:
        resultats.append(
            calculer_exactitude_kv(
                models.Test1ExactitudeKV(**tests["test1"])
            )
        )

    # Test 2
    if "test2" in tests:
        resultats.append(
            calculer_reproductibilite_kv(
                models.Test2ReproductibiliteKV(**tests["test2"])
            )
        )
    # Test 3
    if "test3" in tests:
        resultats.append(
            calculer_linearite_mas(
                models.Test3LineariteMAs(**tests["test3"])
            )
        )
    # Test 4
    if "test4" in tests:
        resultats.append(
            calculer_temps_exposition(
                models.Test4TempsExposition(**tests["test4"])
            )
        )

    # Test 5
    if "test5" in tests:
        resultats.append(
            calculer_cda(
                models.Test5CDA(**tests["test5"])
            )
        )

    if not resultats:
        return {"error": "Aucun test fourni"}

    # ICI on définit bien 'conforme' avant de l'utiliser
    conforme = all(r.status == models.StatusEnum.CONFORME for r in resultats)

    return models.RapportFinal(
        globale=models.StatusEnum.CONFORME if conforme else models.StatusEnum.NON_CONFORME,
        details=resultats,
    )
