import { useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import toast from "react-hot-toast";

export default function Otros({ otros, setOtros, guardarProductos, devMode }) {

  const [eliminando, setEliminando] = useState(null);
  const [agregadoIndex, setAgregadoIndex] = useState(null);

  function agregar() {
    setOtros(prev => {
      const nuevo = [
        ...prev,
        { nombre: "", cantidad: 1, comentario: "", categoria: "otros" }
      ];

      setAgregadoIndex(nuevo.length - 1); // ✅ índice nuevo
      return nuevo;
    });

    // reset animación
    setTimeout(() => setAgregadoIndex(null), 250);
  }

  function actualizar(index, campo, valor) {
    const copia = [...otros];
    copia[index][campo] = valor;
    setOtros(copia);
  }

  function eliminar(index) {
    setEliminando(index);

    setTimeout(() => {
      setOtros(prev => prev.filter((_, i) => i !== index));
      setEliminando(null);
    }, 200);
  }
 
  async function borrarHistorial() {
    try {
      const querySnapshot = await getDocs(collection(db, "listas"));

      const eliminaciones = querySnapshot.docs.map((d) =>
        deleteDoc(doc(db, "listas", d.id))
      );

      await Promise.all(eliminaciones);

      toast.success("Historial eliminado ✅");

    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar historial ❌");
    }
  }

async function contarListas() {
  const snapshot = await getDocs(collection(db, "listas"));
  return snapshot.size;
}

  return (
    <div>
      <h2>OTROS</h2>

      {/* LISTA */}
      {otros.map((o, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 6,
            overflow: "hidden",
            alignItems: "center",             
            flexWrap: "nowrap",
            overflow: "hidden",


            // ✅ ANIMACIÓN ELIMINAR
            transition: "all 0.2s ease",
            opacity: eliminando === i ? 0 : 1,
            transform:
              eliminando === i
                ? "translateX(-10px)"
                : agregadoIndex === i
                  ? "translateY(-5px)"
                  : "translate(0)",
          }}
        >

          {/* ❌ BOTÓN CANCELAR */}
          <button
            onClick={() => {
              toast((t) => (
                <div>
                  ¿Eliminar producto?
                  <br />

                  <button
                    onClick={() => {
                      eliminar(i);
                      toast.dismiss(t.id);
                    }}
                    style={{ marginRight: 5 }}
                  >
                    ✅ Sí
                  </button>

                  <button onClick={() => toast.dismiss(t.id)}>
                    ❌ No
                  </button>
                </div>
              ));
            }}
            style={{
              background: "#f44336",
              border: "none",
              color: "white",
              borderRadius: 6,
              width: 20,
              height: 20,
              fontSize: 11,
              cursor: "pointer"
            }}
          >
            ✖
          </button>

          {/* Nombre */}
          
<input
  placeholder="Producto"
  value={o.nombre}
  onChange={(e) => actualizar(i, "nombre", e.target.value)}
  style={{
    minWidth: 70,       // ✅ no demasiado pequeño
    maxWidth: 110,      // ✅ evita que empuje todo
    flex: "0 0 auto",   // ✅ no se expande

    padding: "3px 6px",
    borderRadius: 6,
    fontSize: 13,
    boxSizing: "border-box"
  }}
/>


          
{/* Cantidad */}
<input
  type="number"
  value={o.cantidad ?? ""}

  onChange={(e) => {
    const value = e.target.value;
    actualizar(i, "cantidad", value === "" ? "" : Number(value));
  }}

  onFocus={(e) => {
    // ✅ borra el 1 automáticamente cuando entrás
    if (e.target.value === "1") {
      actualizar(i, "cantidad", "");
    }
  }}

  onBlur={(e) => {
    if (e.target.value === "") {
      actualizar(i, "cantidad", 1);
    }
  }}

  style={{
    width: 45,
    padding: 3,
    borderRadius: 6,
    fontSize: 13,
    boxSizing: "border-box"
  }}
/>


          {/* Comentario */}
          <input
            placeholder="comentario"
            value={o.comentario}
            onChange={(e) =>
              actualizar(i, "comentario", e.target.value)
            }
            style={{
              flex: 1,
              minWidth: 60,
              maxWidth: 140,
              padding: "3px 6px",
              borderRadius: 6,
              fontSize: 13,
              boxSizing: "border-box"
            }}
          />

          {/* Categoría */}
          <select
            value={o.categoria || "otros"}
            onChange={(e) =>
              actualizar(i, "categoria", e.target.value)
            }
            style={{
              padding: 4,
              borderRadius: 6,
              fontSize: 12
            }}
          >
            <option value="alimentos">🍎</option>
            <option value="limpieza">🧼</option>
            <option value="otros">➕</option>
          </select>

        </div>
      ))}

      {/* BOTONES */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          marginTop: 10
        }}
      >
        <button
          onClick={agregar}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          ➕ Agregar producto
        </button>

        <button
          onClick={guardarProductos}
          style={{
            padding: "8px 16px",
            borderRadius: 10,
            border: "none",
            background: "#4CAF50",
            color: "white",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          ✅ Guardar productos
        </button>
        

        
{devMode && (
  <button
    onClick={async () => {
      const cantidad = await contarListas();   // ✅ obtenemos cantidad

      toast((t) => (
        <div>
          ¿Resetear estadísticas?
          <br />

          <b>{cantidad}</b> listas guardadas

          <br /><br />

          <button
            onClick={async () => {
              await borrarHistorial();
              toast.dismiss(t.id);
            }}
            style={{ marginRight: 5 }}
          >
            ✅ Sí
          </button>

          <button onClick={() => toast.dismiss(t.id)}>
            ❌ No
          </button>
        </div>
      ));
    }}
    style={{
      marginTop: 10,
      padding: "8px 16px",
      borderRadius: 8,
      border: "none",
      background: "#9c27b0",
      color: "white",
      fontWeight: 600,
      cursor: "pointer"
    }}
  >
    🔄 Resetear estadísticas
  </button>
)}

                  <br />

      </div>
    </div>
  );
}