import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function App() {
  const [salud, setSalud] = useState(null);
  const [laboratorios, setLaboratorios] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/api/health`)
      .then((r) => r.json())
      .then(setSalud)
      .catch(() => setError('No se pudo conectar con el backend'));

    fetch(`${API}/api/laboratorios`)
      .then((r) => r.json())
      .then(setLaboratorios)
      .catch(() => {});
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Panaderia_Syslab2.0</h1>
      <p>Practica de Despliegue de Arquitectura y Agentes de IA &mdash; PanaderiaSyslab2.0</p>

      <section style={{ background: '#f4f6f8', padding: '1rem', borderRadius: 8, margin: '1rem 0' }}>
        <h2 style={{ fontSize: '1.1rem' }}>Estado del Backend</h2>
        {error && <p style={{ color: '#b00020' }}>{error}</p>}
        {salud && (
          <ul>
            <li>Servicio: {salud.servicio}</li>
            <li>Estado: {salud.estado}</li>
            <li>Base de datos: {salud.db}</li>
          </ul>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: '1.1rem' }}>Laboratorios registrados</h2>
        {laboratorios.length === 0 && <p>Sin datos todavia.</p>}
        <ul>
          {laboratorios.map((lab) => (
            <li key={lab.id}>
              <strong>{lab.codigo}</strong> &mdash; {lab.nombre} ({lab.ubicacion}) &middot;{' '}
              {lab.equipos?.length || 0} equipos
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
