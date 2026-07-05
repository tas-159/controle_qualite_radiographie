from app.models import Test5CDA, ResultatTest, StatusEnum

# Tableau des CDA minimales (en mm Al) selon le kV
NORMES_CDA = {
    60: 1.5,
    70: 2.1,
    80: 2.3,
    90: 2.5,
    100: 2.7,
    120: 3.0,
}

def interpoler_norme_cda(kv: float) -> float:
    """
    Retourne la CDA minimale requise (mm Al) pour un kV donné,
    par interpolation linéaire entre les valeurs de la table.
    """
    kvs = sorted(NORMES_CDA.keys())
    if kv <= kvs[0]:
        return NORMES_CDA[kvs[0]]
    if kv >= kvs[-1]:
        return NORMES_CDA[kvs[-1]]

    for i in range(len(kvs) - 1):
        k1, k2 = kvs[i], kvs[i + 1]
        if k1 <= kv <= k2:
            v1, v2 = NORMES_CDA[k1], NORMES_CDA[k2]
            # interpolation linéaire entre k1 et k2
            return v1 + (v2 - v1) * (kv - k1) / (k2 - k1)

    # valeur par défaut (ne devrait pas arriver normalement)
    return 2.3


def calculer_cda(data: Test5CDA) -> ResultatTest:
    """
    Calcule la CDA mesurée par interpolation sur les mesures de Kerma
    et compare avec la norme pour le kV utilisé.
    """
    kerma_initial = data.kermas[0]
    kerma_cible = kerma_initial * 0.5  # 50 %

    # Recherche de l’intervalle où le Kerma passe de >50% à <50%
    cda = data.epaisseurs_al[-1]  # valeur par défaut
    for i in range(len(data.kermas) - 1):
        k1, k2 = data.kermas[i], data.kermas[i + 1]
        e1, e2 = data.epaisseurs_al[i], data.epaisseurs_al[i + 1]

        if k1 >= kerma_cible >= k2:
            # interpolation linéaire entre (e1, k1) et (e2, k2)
            cda = e1 + (e2 - e1) * (k1 - kerma_cible) / (k1 - k2)
            break

    norme = interpoler_norme_cda(data.kv_utilise)
    status = StatusEnum.CONFORME if cda >= norme else StatusEnum.NON_CONFORME
    explication = f"CDA: {cda:.2f} mm Al (norme ≥ {norme:.2f} mm Al à {data.kv_utilise:.0f} kV)"

    return ResultatTest(
        nom="Couche Demi-Atténuation (CDA/HVL)",
        status=status,
        ca=cda,
        explication=explication,
    )
