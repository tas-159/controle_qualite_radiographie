from app.models import Test1ExactitudeKV, ResultatTest, StatusEnum

def calculer_exactitude_kv(data: Test1ExactitudeKV) -> ResultatTest:
    cas = []
    for kv_aff, kv_mes in zip(data.kv_affiches, data.kv_mesures):
        if kv_mes == 0:
            ca = float('inf')
        else:
            ca = abs((kv_aff - kv_mes) / kv_mes) * 100
        cas.append(ca)
    ca_max = max(cas)
    status = StatusEnum.CONFORME if ca_max < 10 else StatusEnum.NON_CONFORME
    explication = f"CA max: {ca_max:.1f}% (limite 10%)"
    return ResultatTest(
        nom="Exactitude kV",
        status=status,
        ca=ca_max,
        explication=explication
    )
