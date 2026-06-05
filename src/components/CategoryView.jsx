import { useState } from "react";
import ProductItem from "./ProductItem";
import SearchBar from "./SearchBar";
import { searchProducts } from "../utils/search";

export default function CategoryView({
  productos,
  categoria,
  datos,
  setDatos,
  theme,
  devMode
}) {
  const [search, setSearch] = useState("");

  const filtrados = searchProducts(
    productos
      .filter(p => p.categoria === categoria)
      .sort((a, b) => a.nombre.localeCompare(b.nombre)),
    search.trim()
  );

  

function actualizar(id, campo, valor, nombre) {

  // ✅ ELIMINAR
  if (campo === "remove") {
    setDatos(prev => {
      const copia = { ...prev };
      delete copia[id];
      return copia;
    });
    return;
  }

  // ✅ ACTUALIZAR BIEN
  setDatos(prev => ({
    ...prev,
    [id]: {
      ...prev[id],
      producto: nombre,
      [campo]: valor
    }
  }));
}



  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 10
    }}>

      {/* ✅ HEADER */}
      <div style={{
        padding: 12,
        borderRadius: 12,
        background: "rgba(255,255,255,0.05)",
        color: "inherit"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          <span>
            {categoria === "alimentos" && "🍎"}
            {categoria === "limpieza" && "🧼"}
          </span>

          <h2 style={{
            margin: 0,
            fontSize: 18,
            color: "inherit"
          }}>
            {categoria.toUpperCase()}
          </h2>
        </div>
      </div>

      {/* ✅ SEARCH BAR */}
      <div style={{
        padding: 10,
        borderRadius: 12,
        background: "rgba(255,255,255,0.05)"
      }}>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* ✅ LISTA */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minHeight: 300 // ✅ evita que se achique la app
      }}>
        {filtrados.length === 0 ? (
          <div style={{
            padding: 20,
            textAlign: "center",
            opacity: 0.6,
            fontSize: 14
          }}>
            🔍 No hay resultados para "{search}"
          </div>
        ) : (
          filtrados.map(p => (
            <ProductItem
              key={p.id}
              product={p}
              data={datos[p.id] || {}}
              theme={theme}
              devMode={devMode}
              onChange={(field, value) =>
                actualizar(p.id, field, value, p.nombre)
              }
            />
          ))
        )}
      </div>

    </div>
  );
}
