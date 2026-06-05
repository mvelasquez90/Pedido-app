import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function GraficoEstadisticas({ stats, productos }) {
  if (!stats || stats.total.length === 0) {
    return <div>No hay datos</div>;
  }

  const alimentos = [];
  const limpieza = [];

  stats.total.forEach(([nombre, cantidad]) => {
    const prod = productos.find(p => p.nombre === nombre);

    if (prod?.categoria === "alimentos") {
      alimentos.push({ nombre, cantidad });
    } else if (prod?.categoria === "limpieza") {
      limpieza.push({ nombre, cantidad });
    }
  });

  const topAlimentos = alimentos.slice(0, 5);
  const topLimpieza = limpieza.slice(0, 5);

  return (
    <div style={{ marginTop: 20 }}>

      {/* 🍎 ALIMENTOS */}
      <h3>🍎 Alimentos</h3>

      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topAlimentos}
            layout="vertical"
            margin={{ left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="nombre"
              type="category"
              width={80}
              tick={{ fontSize: 11 }}   // ✅ texto más chico
              
tickFormatter={(value) =>
          value.length > 10 ? value.slice(0, 10) + "…" : value
        }

            />
            <Tooltip formatter={(v) => [`${v} veces`, "Cantidad"]} />
            <Bar dataKey="cantidad" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>


      {/* 🧼 LIMPIEZA */}
      <h3 style={{ marginTop: 30 }}>🧼 Limpieza</h3>

      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topLimpieza}
            layout="vertical"
            margin={{ left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="nombre"
              type="category"
              width={80}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) =>
                  value.length > 10 ? value.slice(0, 10) + "…" : value
}
              
            />
            <Tooltip formatter={(v) => [`${v} veces`, "Cantidad"]} />
            <Bar dataKey="cantidad" fill="#2196F3" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}