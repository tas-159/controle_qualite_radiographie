from app.models import Test4TempsExposition, ResultatTest, StatusEnum

def calculer_temps_exposition(data: Test4TempsExposition) -> ResultatTest:
    cas = []

    for t_aff, t_mes in zip(data.temps_affiches, data.temps_mesures):
        if t_mes == 0:
            ca = float("inf")
        else:
            ca = abs((t_aff - t_mes) / t_mes) * 100
        cas.append(ca)

    ca_max = max(cas)

    # Seuil 10 %
    status = StatusEnum.CONFORME if ca_max < 10 else StatusEnum.NON_CONFORME
    explication = f"CA max: {ca_max:.1f}% (limite 10%)"

    return ResultatTest(
        nom="Temps d'exposition",
        status=status,
        ca=ca_max,
        explication=explication,
    )
