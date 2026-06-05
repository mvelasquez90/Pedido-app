import { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import toast from "react-hot-toast";

export default function ProductItem({
  product,
  data,
  onChange,
  theme,
  devMode
}) {
  const [editNombre, setEditNombre] = useState(product.nombre);
  const [editCategoria, setEditCategoria] = useState(product.categoria);

  async function guardarCambios() {
    try {
      await updateDoc(doc(db, "productos", product.id), {
        nombre: editNombre,
        categoria: editCategoria
      });

      toast.success("Producto actualizado ✅");
    } catch (err) {
      toast.error("Error al guardar ❌");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "center",
        gap: 6,
        padding: "4px 6px",          // ✅ más compacto
        borderRadius: 8,
        minHeight: 36,              // ✅ filas alineadas
        background: data?.checked ? "#4CAF50" : "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: data?.checked ? "white" : "inherit",
        flexWrap: "nowrap",
        overflow: "hidden",

      }}
    >

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={data?.checked || false}
        onChange={(e) => onChange("checked", e.target.checked)}
        style={{
          margin: 0,
          transform: "scale(0.9)"   // ✅ más chico
        }}
      />

      {/* Nombre */}
      {devMode ? (
        <input
          value={editNombre}
          onChange={(e) => setEditNombre(e.target.value)}
          style={{
            width: 100,
            height: 26,
            padding: "2px 4px",
            borderRadius: 6,
            fontSize: 12
          }}
        />
      ) : (
        <span
          style={{
            width: 120,
            fontWeight: 500,
            fontSize: 13,
            lineHeight: "1.1"
          }}
        >
          {product.nombre}
        </span>
      )}

      {/* Categoria */}
      {devMode && (
        <select
          value={editCategoria || "alimentos"}
          onChange={(e) => setEditCategoria(e.target.value)}
          style={{
            height: 26,
            fontSize: 12
          }}
        >
          <option value="alimentos">🍎</option>
          <option value="limpieza">🧼</option>
          <option value="otros">➕</option>
        </select>
      )}

      {/* Cantidad */}
      
<input
  type="number"
  min="1"
  value={data?.cantidad || 1}
  onChange={(e) => onChange("cantidad", Number(e.target.value))}
  style={{
    width: 36,
    height: 26,
    padding: 2,
    textAlign: "center",
    borderRadius: 6,
    border:
      theme.background === "#121212"
        ? "1px solid rgba(255,255,255,0.1)"
        : "1px solid rgba(0,0,0,0.15)",
    background: data?.checked
      ? "rgba(255,255,255,0.9)"   // ✅ fondo claro interno
      : theme.background === "#121212"
        ? "rgba(255,255,255,0.08)"
        : "#f5f5f5",
    color: data?.checked ? "#000" : "inherit",   // ✅ texto visible
    fontSize: 12
  }}
/>


      {/* Comentario */}
      
<input
  placeholder="comentario"
  value={data?.comentario || ""}
  onChange={(e) => onChange("comentario", e.target.value)}
  
style={{
  flex: 1,
  minWidth: 60,                         // ✅ más chico para mobile
  maxWidth: devMode ? 120 : "45%",      // ✅ CLAVE 🔥

  height: 26,
  padding: "2px 6px",
  borderRadius: 6,


    border:
      theme.background === "#121212"
        ? "1px solid rgba(255,255,255,0.1)"
        : "1px solid rgba(0,0,0,0.15)",

    // ✅ fondo dinámico
    background: data?.checked
      ? "rgba(255,255,255,0.9)"   // cuando está seleccionado
      : theme.background === "#121212"
        ? "rgba(255,255,255,0.08)"
        : "#f5f5f5",

    // ✅ color corregido
    color: data?.checked ? "#000" : "inherit",

    fontSize: 12
  }}
/>


      {/* Botones solo en dev */}
      {devMode && (
        <div
          style={{
            display: "flex",
            gap: 4,
            marginLeft: "auto"
          }}
        >
          <button
            onClick={guardarCambios}
            style={{
              background: "#ff9800",
              border: "none",
              color: "white",
              borderRadius: 5,
              padding: "2px 5px",
              fontSize: 11,
              cursor: "pointer"
            }}
          >
            💾
          </button>

          <button
            onClick={() => {
              toast((t) => (
                <div>
                  ¿Eliminar?
                  <br />
                  <button
                    onClick={async () => {
                      await deleteDoc(doc(db, "productos", product.id));
                      toast.success("Eliminado ✅");
                      toast.dismiss(t.id);
                    }}
                    style={{ marginRight: 5 }}
                  >
                    ✅
                  </button>
                  <button onClick={() => toast.dismiss(t.id)}>❌</button>
                </div>
              ));
            }}
            style={{
              background: "#f44336",
              border: "none",
              color: "white",
              borderRadius: 5,
              padding: "2px 5px",
              fontSize: 11,
              cursor: "pointer"
            }}
          >
            ❌
          </button>
        </div>
      )}

    </div>
  );
}