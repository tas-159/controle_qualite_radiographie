import { useState } from "react";
import { calculerTests } from "./api";

function App() {
  const [kvAffiches] = useState([60, 70, 80, 90, 100]);
  const [kvMesures, setKvMesures] = useState(["", "", "", "", ""]);
  const [kvRepMesures, setKvRepMesures] = useState(["", "", "", "", ""]);
  const [cdaKv, setCdaKv] = useState(80);
  const [cdaEp] = useState(["0", "1", "2", "3", "4"]);
  const [cdaKerma, setCdaKerma] = useState(["100", "70", "50", "35", "25"]);

  const [masValues] = useState([5, 10, 15, 20, 25]);
  const [expoValues, setExpoValues] = useState(["", "", "", "", ""]);

  const [tempsAffiches] = useState([10, 20, 50, 100, 200]);
  const [tempsMesures, setTempsMesures] = useState(["", "", "", "", ""]);

  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  const [ongletActif, setOngletActif] = useState("qualite");

  const [dernierRapport, setDernierRapport] = useState(null);
  const [nbControles, setNbControles] = useState(0);

  const [historiqueRapports, setHistoriqueRapports] = useState([]);

  const [nomMachine, setNomMachine] = useState("");
  const [parcMachines, setParcMachines] = useState([]);
  const [nouvelleMachine, setNouvelleMachine] = useState({
    nom: "",
    modele: "",
    service: "",
    annee: "",
  });



  const handleChangeArray = (setter, index, value) => {
    setter((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setLoading(true);
    setResultat(null);

    try {
      const payload = {
        test1: {
          kv_affiches: kvAffiches.map(Number),
          kv_mesures: kvMesures.map(Number),
        },
        test2: {
          kv_mesures: kvRepMesures.map(Number),
        },
        test3: {
          mas: masValues.map(Number),
          expositions: expoValues.map(Number),
        },
        test4: {
          temps_affiches: tempsAffiches.map(Number),
          temps_mesures: tempsMesures.map(Number),
        },
        test5: {
          kv_utilise: Number(cdaKv),
          epaisseurs_al: cdaEp.map(Number),
          kermas: cdaKerma.map(Number),
        },
      };

      const data = await calculerTests(payload);
      setResultat(data);

      // Mise à jour Vue d’ensemble
      const dateJour = new Date().toISOString().slice(0, 10);
      setDernierRapport({
        date: dateJour,
        machine: nomMachine,
        globale: data.globale,
        details: data.details,
      });
      setNbControles((prev) => prev + 1);
            setHistoriqueRapports((prev) => [
        {
          id: Date.now(),
          date: dateJour,
          machine: "nomMachine", // plus tard tu remplaceras par le vrai champ nomMachine
          globale: data.globale,
        },
        ...prev, // pour avoir le plus récent en haut
      ]);

    } catch (err) {
      console.error(err);
      setErreur("Erreur lors de l'appel à l'API.");
    } finally {
      setLoading(false);
    }
  };

  const tableShell = ({ headers, rows }) => (
    <div
      style={{
        overflowX: "auto",
        marginTop: "8px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <table
        style={{
          minWidth: "600px",
          maxWidth: "900px",
          borderCollapse: "separate",
          borderSpacing: 0,
          fontSize: "13px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ background: "#f3f4ff" }}>
            {headers.map((h, idx) => (
              <th
                key={idx}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  borderBottom: "1px solid #e5e7eb",
                  color: "#6b7280",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
    const handleChangeMachine = (field, value) => {
    setNouvelleMachine((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAjouterMachine = (e) => {
    e.preventDefault();
    if (!nouvelleMachine.nom.trim()) return;

    setParcMachines((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...nouvelleMachine,
      },
    ]);

    setNouvelleMachine({
      nom: "",
      modele: "",
      service: "",
      annee: "",
    });
  };

  const handleSupprimerMachine = (id) => {
    setParcMachines((prev) => prev.filter((m) => m.id !== id));
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e0f2ff 0%, #f5f7ff 40%, #ffffff 100%)",
        padding: "16px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "32px auto",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "20px 24px 28px",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.16)",
          border: "1px solid #e0e7ff",
        }}
      >
        {/* En-tête */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: "4px",
              }}
            >
              Plateforme Contrôle Qualité – Radiographie
            </h1>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              Calcul automatique des critères d&apos;acceptabilité et suivi des
              examens de contrôle.
            </p>
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
              padding: "6px 12px",
              borderRadius: "9999px",
              border: "1px solid #d1d5db",
              background: "#f9fafb",
            }}
          >
            Projet Tasnim
          </div>
        </header>

        {/* Onglets */}
        <nav
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "20px",
            background: "#f3f4f6",
            padding: "4px",
            borderRadius: "9999px",
          }}
        >
          {[
            { id: "vue", label: "Vue d’ensemble" },
            { id: "qualite", label: "Contrôle Qualité" },
            { id: "parc", label: "Parc Machines" },
            { id: "rapports", label: "Rapports" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setOngletActif(tab.id)}
              style={{
                flex: 1,
                padding: "8px 16px",
                borderRadius: "9999px",
                border: "none",
                fontSize: "14px",
                cursor: "pointer",
                background:
                  ongletActif === tab.id ? "#2563eb" : "transparent",
                color: ongletActif === tab.id ? "#ffffff" : "#4b5563",
                fontWeight: ongletActif === tab.id ? 600 : 500,
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* VUE D’ENSEMBLE */}
        {ongletActif === "vue" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "16px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h3 style={{ fontSize: "14px", color: "#6b7280" }}>
                  Contrôles effectués
                </h3>
                <p
                  style={{
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "#111827",
                    marginTop: "4px",
                  }}
                >
                  {nbControles}
                </p>
                <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                  Nombre de calculs de conformité réalisés pendant cette
                  session.
                </p>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "16px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h3 style={{ fontSize: "14px", color: "#6b7280" }}>
                  Dernier verdict global
                </h3>
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: dernierRapport
                      ? dernierRapport.globale === "Conforme"
                        ? "#16a34a"
                        : "#b91c1c"
                      : "#9ca3af",
                    marginTop: "4px",
                  }}
                >
                  {dernierRapport ? dernierRapport.globale : "—"}
                </p>
                <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                  Statut global du dernier rapport calculé.
                </p>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "16px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h3 style={{ fontSize: "14px", color: "#6b7280" }}>
                  Date du dernier contrôle
                </h3>
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#111827",
                    marginTop: "4px",
                  }}
                >
                  {dernierRapport ? dernierRapport.date : "—"}
                </p>
                <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                  Date à laquelle le dernier calcul de conformité a été
                  effectué.
                </p>
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "16px",
                border: "1px solid #e5e7eb",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  marginBottom: "8px",
                  color: "#111827",
                }}
              >
                Dernier rapport de contrôle
              </h2>

              {!dernierRapport && (
                <p style={{ fontSize: "14px", color: "#6b7280" }}>
                  Aucun contrôle enregistré pour l&apos;instant. Lance un
                  calcul dans l&apos;onglet « Contrôle Qualité » pour voir un
                  résumé ici.
                </p>
              )}

              {dernierRapport && (
                <>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#4b5563",
                      marginBottom: "4px",
                    }}
                  >
                    Machine : <strong>{dernierRapport.machine}</strong>
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#4b5563",
                      marginBottom: "8px",
                    }}
                  >
                    Date du contrôle :{" "}
                    <strong>{dernierRapport.date}</strong>
                  </p>

                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {dernierRapport.details.map((t, idx) => (
                      <li
                        key={idx}
                        style={{
                          marginBottom: "8px",
                          padding: "8px 10px",
                          borderRadius: "10px",
                          background: "#f9fafb",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>
                          {t.nom} — {t.status}
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#6b7280",
                            marginTop: "2px",
                          }}
                        >
                          {t.explication}
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}

        {/* CONTRÔLE QUALITÉ */}

        {ongletActif === "qualite" && (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontSize: "13px",
                  marginRight: "8px",
                  color: "#374151",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Nom de la machine :
              </label>
              <input
                type="text"
                value={nomMachine}
                onChange={(e) => setNomMachine(e.target.value)}
                placeholder="Ex: Salle radio 1 – GÉN RX 023"
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
                required
              />
            </div>
            <form onSubmit={handleSubmit}>
              {/* Test 1 */}
              <section
                style={{
                  marginBottom: "20px",
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "16px 16px 20px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    marginBottom: "4px",
                    color: "#111827",
                  }}
                >
                  1. Exactitude du kV
                </h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginBottom: "12px",
                  }}
                >
                  Saisir les kV mesurés pour chaque valeur affichée sur la
                  console.
                </p>

                {tableShell({
                  headers: ["kV affiché", "kV mesuré"],
                  rows: kvAffiches.map((kv, i) => (
                    <tr key={i}>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom:
                            i === kvAffiches.length - 1
                              ? "none"
                              : "1px solid #f3f4f6",
                          color: "#111827",
                          background: "#ffffff",
                        }}
                      >
                        {kv}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom:
                            i === kvAffiches.length - 1
                              ? "none"
                              : "1px solid #f3f4f6",
                          background: "#ffffff",
                        }}
                      >
                        <input
                          type="number"
                          step="0.1"
                          value={kvMesures[i]}
                          onChange={(e) =>
                            handleChangeArray(
                              setKvMesures,
                              i,
                              e.target.value
                            )
                          }
                          placeholder="kV mesuré"
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            fontSize: "13px",
                          }}
                          required
                        />
                      </td>
                    </tr>
                  )),
                })}
              </section>

              {/* Test 2 */}
              <section
                style={{
                  marginBottom: "20px",
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "16px 16px 20px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    marginBottom: "4px",
                    color: "#111827",
                  }}
                >
                  2. Reproductibilité du kV
                </h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginBottom: "12px",
                  }}
                >
                  Saisir 5 mesures successives du même réglage kV.
                </p>

                {tableShell({
                  headers: ["Mesure n°", "kV mesuré"],
                  rows: kvRepMesures.map((val, i) => (
                    <tr key={i}>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom:
                            i === kvRepMesures.length - 1
                              ? "none"
                              : "1px solid #f3f4f6",
                          color: "#111827",
                          background: "#ffffff",
                        }}
                      >
                        {i + 1}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom:
                            i === kvRepMesures.length - 1
                              ? "none"
                              : "1px solid #f3f4f6",
                          background: "#ffffff",
                        }}
                      >
                        <input
                          type="number"
                          step="0.1"
                          value={val}
                          onChange={(e) =>
                            handleChangeArray(
                              setKvRepMesures,
                              i,
                              e.target.value
                            )
                          }
                          placeholder="kV mesuré"
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            fontSize: "13px",
                          }}
                          required
                        />
                      </td>
                    </tr>
                  )),
                })}
              </section>

              {/* Test 3 */}
              <section
                style={{
                  marginBottom: "20px",
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "16px 16px 20px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    marginBottom: "4px",
                    color: "#111827",
                  }}
                >
                  3. Linéarité du mAs
                </h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginBottom: "12px",
                  }}
                >
                  Pour chaque valeur de mAs programmée, saisir l&apos;exposition
                  mesurée.
                </p>

                {tableShell({
                  headers: ["mAs", "Exposition mesurée"],
                  rows: masValues.map((val, i) => (
                    <tr key={i}>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom:
                            i === masValues.length - 1
                              ? "none"
                              : "1px solid #f3f4f6",
                          color: "#111827",
                          background: "#ffffff",
                        }}
                      >
                        {val}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom:
                            i === masValues.length - 1
                              ? "none"
                              : "1px solid #f3f4f6",
                          background: "#ffffff",
                        }}
                      >
                        <input
                          type="number"
                          step="0.1"
                          value={expoValues[i]}
                          onChange={(e) =>
                            handleChangeArray(
                              setExpoValues,
                              i,
                              e.target.value
                            )
                          }
                          placeholder="Exposition"
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            fontSize: "13px",
                          }}
                          required
                        />
                      </td>
                    </tr>
                  )),
                })}
              </section>

              {/* Test 4 */}
              <section
                style={{
                  marginBottom: "20px",
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "16px 16px 20px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    marginBottom: "4px",
                    color: "#111827",
                  }}
                >
                  4. Temps d&apos;exposition
                </h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginBottom: "12px",
                  }}
                >
                  Saisir les temps mesurés pour chaque temps affiché (en ms).
                </p>

                {tableShell({
                  headers: ["Temps affiché (ms)", "Temps mesuré (ms)"],
                  rows: tempsAffiches.map((t, i) => (
                    <tr key={i}>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom:
                            i === tempsAffiches.length - 1
                              ? "none"
                              : "1px solid #f3f4f6",
                          color: "#111827",
                          background: "#ffffff",
                        }}
                      >
                        {t}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom:
                            i === tempsAffiches.length - 1
                              ? "none"
                              : "1px solid #f3f4f6",
                          background: "#ffffff",
                        }}
                      >
                        <input
                          type="number"
                          step="0.1"
                          value={tempsMesures[i]}
                          onChange={(e) =>
                            handleChangeArray(
                              setTempsMesures,
                              i,
                              e.target.value
                            )
                          }
                          placeholder="Temps mesuré"
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            fontSize: "13px",
                          }}
                          required
                        />
                      </td>
                    </tr>
                  )),
                })}
              </section>

              {/* Test 5 */}
              <section
                style={{
                  marginBottom: "20px",
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "16px 16px 20px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    marginBottom: "4px",
                    color: "#111827",
                  }}
                >
                  5. CDA / HVL
                </h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginBottom: "12px",
                  }}
                >
                  Saisir les kermas mesurés pour chaque épaisseur
                  d&apos;Aluminium et le kV utilisé.
                </p>

                <div style={{ marginBottom: "8px" }}>
                  <label
                    style={{
                      fontSize: "13px",
                      marginRight: "8px",
                      color: "#374151",
                    }}
                  >
                    kV utilisé :
                  </label>
                  <input
                    type="number"
                    value={cdaKv}
                    onChange={(e) => setCdaKv(e.target.value)}
                    style={{
                      width: "100px",
                      padding: "6px 8px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      fontSize: "13px",
                    }}
                  />
                </div>

                {tableShell({
                  headers: ["Épaisseur (mm Al)", "Kerma (µGy)"],
                  rows: cdaEp.map((ep, i) => (
                    <tr key={i}>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom:
                            i === cdaEp.length - 1
                              ? "none"
                              : "1px solid #f3f4f6",
                          color: "#111827",
                          background: "#ffffff",
                        }}
                      >
                        {ep}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom:
                            i === cdaEp.length - 1
                              ? "none"
                              : "1px solid #f3f4f6",
                          background: "#ffffff",
                        }}
                      >
                        <input
                          type="number"
                          step="0.1"
                          value={cdaKerma[i]}
                          onChange={(e) =>
                            handleChangeArray(
                              setCdaKerma,
                              i,
                              e.target.value
                            )
                          }
                          placeholder="Kerma"
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            fontSize: "13px",
                          }}
                          required
                        />
                      </td>
                    </tr>
                  )),
                })}
              </section>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "9999px",
                  border: "none",
                  background: "#2563eb",
                  color: "#ffffff",
                  fontWeight: "600",
                  fontSize: "16px",
                  cursor: "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Calcul en cours..." : "Calculer la conformité"}
              </button>
            </form>

            {erreur && (
              <p style={{ color: "#b91c1c", marginTop: "16px" }}>{erreur}</p>
            )}

            {resultat && (
              <div style={{ marginTop: "24px" }}>
                <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
                  Résultat global : {resultat.globale}
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    marginBottom: "12px",
                  }}
                >
                  {resultat.details.some((t) => t.status.includes("❌"))
                    ? "Certains critères ne sont pas conformes. Détails ci-dessous."
                    : "Tous les critères sont conformes pour cette machine."}
                </p>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {resultat.details.map((test, idx) => (
                    <li
                      key={idx}
                      style={{
                        marginBottom: "12px",
                        padding: "12px",
                        borderRadius: "12px",
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <div style={{ fontWeight: "600" }}>
                        {test.nom} — {test.status}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#4b5563",
                          marginTop: "4px",
                        }}
                      >
                        {test.explication}
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    marginTop: "16px",
                    padding: "8px 16px",
                    borderRadius: "9999px",
                    border: "1px solid #2563eb",
                    background: "#ffffff",
                    color: "#2563eb",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Imprimer le rapport
                </button>
              </div>
            )}
          </div>
        )}


        {/* Parc machines & Rapports (inchangé) */}
        {ongletActif === "parc" && (
  <div
    style={{
      background: "#ffffff",
      borderRadius: "16px",
      padding: "16px",
      border: "1px solid #e5e7eb",
    }}
  >
    <h2 style={{ fontSize: "18px", marginBottom: "8px", color: "#111827" }}>
      Parc Machines
    </h2>
    <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "12px" }}>
      Ajouter et suivre les générateurs de rayons X contrôlés.
    </p>

    {/* ICI le <form onSubmit={handleAjouterMachine}> ... puis la table */}


            {/* Formulaire ajout machine */}
            <form
              onSubmit={handleAjouterMachine}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "8px",
                marginBottom: "16px",
                alignItems: "end",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    color: "#374151",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Nom de la machine
                </label>
                <input
                  type="text"
                  value={nouvelleMachine.nom}
                  onChange={(e) => handleChangeMachine("nom", e.target.value)}
                  placeholder="Ex: Générateur RX 023"
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "13px",
                  }}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: "13px",
                    color: "#374151",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Modèle
                </label>
                <input
                  type="text"
                  value={nouvelleMachine.modele}
                  onChange={(e) => handleChangeMachine("modele", e.target.value)}
                  placeholder="Ex: DRX-300"
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: "13px",
                    color: "#374151",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Service
                </label>
                <input
                  type="text"
                  value={nouvelleMachine.service}
                  onChange={(e) =>
                    handleChangeMachine("service", e.target.value)
                  }
                  placeholder="Ex: Radiologie Urgences"
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: "13px",
                    color: "#374151",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Année d&apos;installation
                </label>
                <input
                  type="number"
                  value={nouvelleMachine.annee}
                  onChange={(e) => handleChangeMachine("annee", e.target.value)}
                  placeholder="Ex: 2020"
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "13px",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: "8px 12px",
                  borderRadius: "9999px",
                  border: "none",
                  background: "#16a34a",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  marginTop: "18px",
                }}
              >
                Ajouter la machine
              </button>
            </form>

            {/* Liste des machines */}
            {parcMachines.length === 0 ? (
              <p style={{ fontSize: "14px", color: "#6b7280" }}>
                Aucune machine enregistrée pour le moment.
              </p>
            ) : (
              <div
                style={{
                  overflowX: "auto",
                  marginTop: "8px",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "separate",
                    borderSpacing: 0,
                    fontSize: "13px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f3f4f6" }}>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px 10px",
                          borderBottom: "1px solid #e5e7eb",
                          color: "#6b7280",
                        }}
                      >
                        Nom
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px 10px",
                          borderBottom: "1px solid #e5e7eb",
                          color: "#6b7280",
                        }}
                      >
                        Modèle
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px 10px",
                          borderBottom: "1px solid #e5e7eb",
                          color: "#6b7280",
                        }}
                      >
                        Service
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px 10px",
                          borderBottom: "1px solid #e5e7eb",
                          color: "#6b7280",
                        }}
                      >
                        Année
                      </th>
                      <th
                        style={{
                          textAlign: "right",
                          padding: "8px 10px",
                          borderBottom: "1px solid #e5e7eb",
                          color: "#6b7280",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {parcMachines.map((m) => (
                      <tr key={m.id}>
                        <td
                          style={{
                            padding: "8px 10px",
                            borderBottom: "1px solid #f3f4f6",
                            color: "#111827",
                          }}
                        >
                          {m.nom}
                        </td>
                        <td
                          style={{
                            padding: "8px 10px",
                            borderBottom: "1px solid #f3f4f6",
                            color: "#4b5563",
                          }}
                        >
                          {m.modele || "—"}
                        </td>
                        <td
                          style={{
                            padding: "8px 10px",
                            borderBottom: "1px solid #f3f4f6",
                            color: "#4b5563",
                          }}
                        >
                          {m.service || "—"}
                        </td>
                        <td
                          style={{
                            padding: "8px 10px",
                            borderBottom: "1px solid #f3f4f6",
                            color: "#4b5563",
                          }}
                        >
                          {m.annee || "—"}
                        </td>
                        <td
                          style={{
                            padding: "8px 10px",
                            borderBottom: "1px solid #f3f4f6",
                            textAlign: "right",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleSupprimerMachine(m.id)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "9999px",
                              border: "1px solid #dc2626",
                              background: "#fee2e2",
                              color: "#b91c1c",
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}


{ongletActif === "rapports" && (
  <div
    style={{
      background: "#ffffff",
      borderRadius: "16px",
      padding: "16px",
      border: "1px solid #e5e7eb",
    }}
  >
    <h2 style={{ fontSize: "18px", marginBottom: "8px", color: "#111827" }}>
      Rapports de contrôle
    </h2>
    <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "12px" }}>
      Historique des contrôles réalisés pendant cette session (non sauvegardé).
    </p>

    {historiqueRapports.length === 0 ? (
      <p style={{ fontSize: "14px", color: "#6b7280" }}>
        Aucun contrôle enregistré pour l&apos;instant. Lance un calcul dans
        l&apos;onglet « Contrôle Qualité ».
      </p>
    ) : (
      <div
        style={{
          overflowX: "auto",
          marginTop: "8px",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            fontSize: "13px",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px 10px",
                  borderBottom: "1px solid #e5e7eb",
                  color: "#6b7280",
                }}
              >
                Date
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px 10px",
                  borderBottom: "1px solid #e5e7eb",
                  color: "#6b7280",
                }}
              >
                Machine
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px 10px",
                  borderBottom: "1px solid #e5e7eb",
                  color: "#6b7280",
                }}
              >
                Verdict global
              </th>
            </tr>
          </thead>
          <tbody>
            {historiqueRapports.map((r) => (
              <tr key={r.id}>
                <td
                  style={{
                    padding: "8px 10px",
                    borderBottom: "1px solid #f3f4f6",
                    color: "#111827",
                  }}
                >
                  {r.date}
                </td>
                <td
                  style={{
                    padding: "8px 10px",
                    borderBottom: "1px solid #f3f4f6",
                    color: "#4b5563",
                  }}
                >
                  {r.machine}
                </td>
                <td
                  style={{
                    padding: "8px 10px",
                    borderBottom: "1px solid #f3f4f6",
                    color:
                      r.globale === "Conforme" ? "#16a34a" : "#b91c1c",
                    fontWeight: 600,
                  }}
                >
                  {r.globale}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

      </div>
    </div>
  );
}

export default App;
