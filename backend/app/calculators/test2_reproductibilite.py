from app.models import Test2ReproductibiliteKV, ResultatTest, StatusEnum

def calculer_reproductibilite_kv(data: Test2ReproductibiliteKV) -> ResultatTest:
    if len(data.kv_mesures) == 0:
        return ResultatTest(
            nom="Reproductibilité kV",
            status=StatusEnum.NON_CONFORME,
            ca=0,
            explication="Aucune mesure"
        )

    max_kv = max(data.kv_mesures)
    min_kv = min(data.kv_mesures)
    moyenne = sum(data.kv_mesures) / len(data.kv_mesures)

    if moyenne == 0:
        ca = float('inf')
    else:
        ca = (max_kv - min_kv) / moyenne * 100

    # Si tu veux que 5% soit CONFORME, mets <= 5
    status = StatusEnum.CONFORME if ca <= 5 else StatusEnum.NON_CONFORME
    explication = f"(Max: {max_kv:.1f}, Min: {min_kv:.1f}, Moy: {moyenne:.1f}) CA: {ca:.1f}% (limite 5%)"

    return ResultatTest(
        nom="Reproductibilité kV",
        status=status,
        ca=ca,
        explication=explication
    )
