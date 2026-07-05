from pydantic import BaseModel, Field
from typing import List
from enum import Enum

class StatusEnum(str, Enum):
    CONFORME = "✅ CONFORME"
    NON_CONFORME = "❌ NON CONFORME"

class Test1ExactitudeKV(BaseModel):
    kv_affiches: List[float] = Field(..., min_items=5)
    kv_mesures: List[float] = Field(..., min_items=5)

class Test2ReproductibiliteKV(BaseModel):
    kv_mesures: List[float] = Field(..., min_items=5)

class Test3LineariteMAs(BaseModel):
    mas: List[float] = Field(..., min_items=5)
    expositions: List[float] = Field(..., min_items=5)

class Test4TempsExposition(BaseModel):
    temps_affiches: List[float] = Field(..., min_items=5)
    temps_mesures: List[float] = Field(..., min_items=5)

class Test5CDA(BaseModel):
    kv_utilise: float
    epaisseurs_al: List[float] = Field(..., min_items=5)
    kermas: List[float] = Field(..., min_items=5)

class ResultatTest(BaseModel):
    nom: str
    status: StatusEnum
    ca: float
    explication: str

class RapportFinal(BaseModel):
    globale: StatusEnum
    details: List[ResultatTest]
