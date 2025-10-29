// src/App.tsx
import { useState } from "react";
import "./app.css";

type Form = {
  coiffeuse: string;
  prestations: string[];
  rituel: string[];
  resultat: string;
  objection: string;
  conseil: string[];
};

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbxZGPrpltz3LSzvvLr-dGvKvwNAuzKraUcheWZsXGyltTxUXyJGd3fuORCXWiBT1yYxZA/exec";
export default function App() {
  const [form, setForm] = useState<Form>({
    coiffeuse: "",
    prestations: [],
    rituel: [],
    resultat: "",
    objection: "",
    conseil: [],
  });

  const [load, setLoad] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);

  /* -------- cases à cocher -------- */
  const toggle = (key: keyof Form, val: string) =>
    setForm((f) => ({
      ...f,
      [key]: (f[key] as string[]).includes(val)
        ? (f[key] as string[]).filter((v) => v !== val)
        : [...(f[key] as string[]), val],
    }));

  const send = async () => {
    setLoad(true);
    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ data: JSON.stringify(form) }),
      });
      const ans = await res.json();
      if (!ans.ok) throw ans.msg;
      setOk(true);
      setTimeout(() => setOk(null), 2000);
      setForm({
        coiffeuse: "",
        prestations: [],
        rituel: [],
        resultat: "",
        objection: "",
        conseil: [],
      });
    } catch (e) {
      console.error(e);
      alert("Erreur : " + e);
      setOk(false);
    }
    setLoad(false);
  };

  return (
    <div className="card">
      <h2>Suivi des ventes en salon</h2>

      {/* 1 dropdown */}
      <label>Coiffeuse</label>
      <select
        value={form.coiffeuse}
        onChange={(e) => setForm({ ...form, coiffeuse: e.target.value })}
      >
        <option value="">—</option>
        <option>Melina</option>
        <option>Lydia</option>
        <option>Lola</option>
        <option>Sophia</option>
      </select>

      {/* reste = cases à cocher */}
      <label>Prestations</label>
      <div className="checks">
        {["Coupe", "Brushing", "Rituel"].map((p) => (
          <label key={p}>
            <input
              type="checkbox"
              checked={form.prestations.includes(p)}
              onChange={() => toggle("prestations", p)}
            />
            {p}
          </label>
        ))}
      </div>

      <label>Rituel proposé</label>
      <div className="checks">
        {["Oui", "Non"].map((r) => (
          <label key={r}>
            <input
              type="checkbox"
              checked={form.rituel.includes(r)}
              onChange={() => toggle("rituel", r)}
            />
            {r}
          </label>
        ))}
      </div>

      <label>Résultat vente</label>
      <div className="checks">
        {["Produit", "Rituel", "Abonnement", "Rien"].map((r) => (
          <label key={r}>
            <input
              type="checkbox"
              checked={form.resultat === r}
              onChange={() => setForm({ ...form, resultat: r })}
            />
            {r}
          </label>
        ))}
      </div>

      <label>Objection</label>
      <div className="checks">
        {["Trop cher", "Pas besion", "A voir plus tard"].map((o) => (
          <label key={o}>
            <input
              type="checkbox"
              checked={form.objection === o}
              onChange={() => setForm({ ...form, objection: o })}
            />
            {o}
          </label>
        ))}
      </div>

      <label>Conseil prochaine fois</label>
      <div className="checks">
        {["Abonnement", "Rituel"].map((c) => (
          <label key={c}>
            <input
              type="checkbox"
              checked={form.conseil.includes(c)}
              onChange={() => toggle("conseil", c)}
            />
            {c}
          </label>
        ))}
      </div>

      <button disabled={load || !form.coiffeuse} onClick={send}>
        {load ? "Envoi..." : "Envoyer"}
      </button>

      {ok === true && <p className="ok">✅ Envoyé !</p>}
      {ok === false && <p className="ko">❌ Erreur</p>}
    </div>
  );
}
