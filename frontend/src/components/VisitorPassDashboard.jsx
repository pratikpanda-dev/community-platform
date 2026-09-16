import { useEffect, useState } from "react";
import { visitorPassApi } from "../api/visitorPassApi";
import "./VisitorPassDashboard.css";

function localDateString() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000).toISOString().slice(0, 10);
}

export default function VisitorPassDashboard() {
  const [passes, setPasses] = useState([]);
  const [form, setForm] = useState({ visitorName: "", visitorPhone: "", purpose: "", visitDate: localDateString() });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPasses();
  }, []);

  async function loadPasses() {
    try {
      setPasses(await visitorPassApi.getMine());
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function createPass(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const pass = await visitorPassApi.create(form);
      setPasses((current) => [pass, ...current]);
      setForm({ visitorName: "", visitorPhone: "", purpose: "", visitDate: localDateString() });
      setMessage({ type: "success", text: `Visitor pass ${pass.passCode} created successfully.` });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="visitor-pass-dashboard">
      <header className="visitor-pass-header">
        <p className="visitor-pass-eyebrow">Guest access</p>
        <h1>Visitor Passes</h1>
        <p>Create a one-day pass for a guest visiting your community.</p>
      </header>

      <form className="visitor-pass-form" onSubmit={createPass}>
        <h2>Create visitor pass</h2>
        <div className="visitor-pass-fields">
          <label>Visitor name<input required value={form.visitorName} onChange={(event) => updateForm("visitorName", event.target.value)} /></label>
          <label>Phone number<input required type="tel" value={form.visitorPhone} onChange={(event) => updateForm("visitorPhone", event.target.value)} /></label>
          <label>Visit date<input required type="date" min={localDateString()} value={form.visitDate} onChange={(event) => updateForm("visitDate", event.target.value)} /></label>
          <label className="visitor-purpose">Purpose of visit<input required value={form.purpose} onChange={(event) => updateForm("purpose", event.target.value)} /></label>
        </div>
        <button className="btn btn-primary" disabled={submitting}>{submitting ? "Creating…" : "Create Pass"}</button>
      </form>

      {message && <div className={`visitor-pass-message visitor-pass-message-${message.type}`}>{message.text}</div>}

      <section className="visitor-pass-list-section">
        <h2>My visitor passes</h2>
        {passes.length === 0 ? (
          <p className="visitor-pass-empty">No visitor passes created yet.</p>
        ) : (
          <div className="visitor-pass-list">
            {passes.map((pass) => (
              <article className="visitor-pass-card" key={pass.id}>
                <div>
                  <h3>{pass.visitorName}</h3>
                  <p>{pass.visitorPhone} · {pass.purpose}</p>
                  <p className="visitor-pass-date">Valid on {pass.visitDate}</p>
                </div>
                <div className="visitor-pass-code">
                  <span>Pass code</span>
                  <strong>{pass.passCode}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
