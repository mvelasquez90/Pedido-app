import GraficoEstadisticas from "./GraficoEstadisticas";

export default function Estadisticas({ stats, productos }) {
  if (!stats || stats.total.length === 0) {
    return <div>No hay datos aún</div>;
  }

  return (
    
<div style={{
  padding: 10,
  background: "transparent",
  color: "inherit"
}}>
      
<h2 style={{ color: "inherit" }}>
  📊 Estadísticas
</h2>


      <div style={{ marginBottom: 15 }}>
        <strong>Total productos registrados: </strong>
        {stats.total.length}
      </div>

      <h3>🔥 Más comprados</h3>
      {stats.masComprados.map(([nombre, cantidad], i) => (
        <div key={i}>
          {i + 1}. {nombre} → {cantidad}
        </div>
      ))}

      <br />

      <h3>❄️ Menos comprados</h3>
      {stats.menosComprados.map(([nombre, cantidad], i) => (
        <div key={i}>
          {i + 1}. {nombre} → {cantidad}
        </div>
      ))}

      {/* ✅ GRÁFICO MEJORADO */}
      <GraficoEstadisticas stats={stats} productos={productos} />

    </div>
  );
}
``