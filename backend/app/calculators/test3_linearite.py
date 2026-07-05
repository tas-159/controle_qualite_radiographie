from app.models import Test3LineariteMAs, ResultatTest, StatusEnum

def calculer_linearite_mas(data: Test3LineariteMAs) -> ResultatTest:
    # Calcul des ratios Exposition / mAs
    ratios = []
    for m, expo in zip(data.mas, data.expositions):
        if m == 0:
            continue
        ratios.append(expo / m)

    if not ratios:
        return ResultatTest(
            nom="Linéarité mAs",
            status=StatusEnum.NON_CONFORME,
            ca=0.0,
            explication="Aucune mesure valide (mAs = 0).",
        )

    moyenne = sum(ratios) / len(ratios)

    # CA pour chaque colonne, on garde le max pour la décision
    cas = []
    for r in ratios:
        ca = abs(r - moyenne) / moyenne * 100
        cas.append(ca)

    ca_max = max(cas)

    # Seuil 10 %
    status = StatusEnum.CONFORME if ca_max < 10 else StatusEnum.NON_CONFORME
    explication = f"CA max: {ca_max:.1f}% (limite 10%)"

    return ResultatTest(
        nom="Linéarité mAs",
        status=status,
        ca=ca_max,
        explication=explication,
    )
