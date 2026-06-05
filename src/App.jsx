import jsPDF from "jspdf";
import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "./services/firebase";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import {
  guardarProducto,
} from "./services/db";

import CategoryView from "./components/CategoryView";
import Otros from "./components/Otros";
import Estadisticas from "./components/Estadisticas";

export default function App() {

  // 🔥 Fecha
  const hoy = new Date();

  const mesInicial =
    hoy.getMonth() === 11 ? 1 : hoy.getMonth() + 1;

  const anioInicial =
    hoy.getMonth() === 11
      ? hoy.getFullYear() + 1
      : hoy.getFullYear();

  // ✅ ESTADOS
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState("alimentos");
  const [datos, setDatos] = useState({});
  const [mes, setMes] = useState(mesInicial);
  const [anio, setAnio] = useState(anioInicial);
  const [otros, setOtros] = useState([]);
  const [listas, setListas] = useState([]);
  const [autoSeleccion, setAutoSeleccion] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");


  // ✅ guardar preferencia dark mode
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setDarkMode(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  
useEffect(() => {
  const saved = localStorage.getItem("autoSel");
  if (saved) setAutoSeleccion(saved === "true");
}, []);

useEffect(() => {
  localStorage.setItem("autoSel", autoSeleccion);
}, [autoSeleccion]);


  // ✅ TEMA
  const theme = {
    background: darkMode ? "#121212" : "#ffffff",
    text: darkMode ? "#ffffff" : "#000000",
    subText: darkMode ? "#bbbbbb" : "#666",
    card: darkMode ? "#1e1e1e" : "#f0f0f0"
  };

  // ✅ PRODUCTOS (tiempo real)
useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "productos"), (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setProductos(data);
  });

  return () => unsubscribe();
}, []);


// ✅ LISTAS (tiempo real)
useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "listas"), (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setListas(data);
  });

  return () => unsubscribe();
}, []);


  // ✅ autoselección
  
useEffect(() => {

  // ✅ Si está apagado → limpiar selección automática
  if (!autoSeleccion) {
    setDatos({});
    return;
  }

  if (!listas.length || !productos.length) return;

  const frecuencia = obtenerFrecuencia();
  const nuevoDatos = {};

  productos.forEach(p => {
    if (frecuencia[p.nombre] >= 2) {
      nuevoDatos[p.id] = {
        producto: p.nombre,
        checked: true,
        cantidad: 1
      };
    }
  });

  setDatos(nuevoDatos);

}, [listas, productos, autoSeleccion]);


  function obtenerFrecuencia() {
    const contador = {};

    listas.forEach(l => {
      if (!l?.items) return;

      l.items.forEach(i => {
        contador[i.producto] =
          (contador[i.producto] || 0) + 1;
      });
    });

    return contador;
  }

  function generarEstadisticas() {
    const frecuencia = obtenerFrecuencia();

    const ordenado = Object.entries(frecuencia)
      .sort((a, b) => b[1] - a[1]);

    return {
      masComprados: ordenado.slice(0, 5),
      menosComprados: ordenado.slice(-5).reverse(),
      total: ordenado
    };
  }

  const stats = listas.length > 0 ? generarEstadisticas() : null;

  // ✅ lista final
  function generarLista() {
    const items = Object.values(datos)
      .filter(d => d?.checked)
      .map(d => ({
        producto: d.producto,
        cantidad: d.cantidad || 1,
        comentario: d.comentario || ""
      }));

    otros.forEach(o => {
      if (o.nombre) {
        items.push(o);
      }
    });

    return items;
  }

  function obtenerOtrosNuevos() {
    return otros.filter(o =>
      o.nombre && !productos.find(p => p.nombre === o.nombre)
    );
  }


async function guardar() {
  const lista = { mes, anio, items: generarLista() };

  await addDoc(collection(db, "listas"), lista);

  setOtros([]);

  alert("✅ Guardado");
}


async function guardarProductos() {
  const nuevos = obtenerOtrosNuevos();

  for (const p of nuevos) {
    if (p.categoria !== "otros") {

      
if (!productos.find(
  prod => prod.nombre.toLowerCase() === p.nombre.toLowerCase()
)){

        await guardarProducto({
          nombre: p.nombre,
          categoria: p.categoria
        });
      }

      setDatos(prev => ({
        ...prev,
        [p.nombre]: {
          producto: p.nombre,
          checked: true,
          cantidad: p.cantidad || 1,
          comentario: p.comentario || ""
        }
      }));
    }
  }

  setOtros(prev => prev.filter(o => o.categoria === "otros"));

  alert("✅ Productos guardados");
}



  function generarTexto() {
    return generarLista()
      .map(i => `${i.producto} x${i.cantidad}`)
      .join("\n");
  }

  function compartir() {
    window.open(`https://wa.me/?text=${encodeURIComponent(generarTexto())}`);
  }

  function generarPDF() {
    const doc = new jsPDF();
    doc.text(generarTexto(), 10, 10);
    doc.save("lista.pdf");
  }

  // ✅ UI BUTTONS
  
  function btn(active) {
    return {
      flex: 1,
      padding: 12,
      borderRadius: 14,
      border: "none",
      background: active ? "#4CAF50" : theme.card,
      color: active ? "white" : theme.text,
      fontSize: 13,
      transition: "0.2s",
      boxShadow: active
        ? "0 4px 10px rgba(0,0,0,0.2)"
        : "none"
    };
  }


  function actionBtn(color) {
    return {
      flex: 1,
      padding: 12,
      borderRadius: 12,
      border: "none",
      background: color,
      color: "white",
      fontSize: 13,
      fontWeight: 600,  
      fontFamily: "var(--sans)", 
      display: "flex",
      flexDirection: "column",
      alignItems:"center",
      justifyContent:"center",
      gap:4,
      letterSpacing: "-0.2px"

    };
  }

  return (
    

<div style={{
  width: "100%",
  maxWidth: 480,
  minWidth: 320,
  margin: "0 auto",
  padding: 15,
  paddingBottom: 100,
  fontFamily: "Arial",

  background: theme.background,
  color: theme.text,
  minHeight: "100vh",

  transition: "0.3s",

  // ✅ RESPONSIVE FIX
  boxSizing: "border-box",
  overflowX: "hidden"
}}>


     
{/* HEADER */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative"   // ✅ clave para centrar
  }}
>

  {/* IZQUIERDA → DEV */}
  <button
    

onClick={() => {
  if (devMode) {
    setDevMode(false);
  } else {
    setShowLogin(true);
  }
}}


    style={{
      background: devMode ? "#ff9800" : "transparent",
      border: "none",
      color: theme.text,
      fontSize: 18,
      cursor: "pointer"
    }}
  >
    🛠️
  </button>

  {/* CENTRO → TÍTULO */}
  <h2
    style={{
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      fontWeight: 600,
      letterSpacing: "-0.3px",
      margin: 0
    }}
  >
    🛒 Compras
  </h2>

  {/* DERECHA → DARK MODE */}
  <button
    onClick={() => setDarkMode(!darkMode)}
    style={{
      background: "none",
      border: "none",
      color: theme.text,
      fontSize: 20,
      cursor: "pointer"
    }}
  >
    {darkMode ? "☀️" : "🌙"}
  </button>

</div>


{showLogin && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}
  >
    <div
      style={{
        background: theme.background,
        color: theme.text,
        padding: "24px 20px",
        borderRadius: 12,
        width: 300,
        textAlign: "center",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        lineHeight: "1.4"
      }}
    >
      <h3 style={{ marginBottom: 10 }}>Modo administrador</h3>

      <input
        type="password"
        placeholder="Código"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          marginTop: 6,
          marginBottom: 12,
          border: "1px solid #ccc",
          boxSizing: "border-box"
        }}
      />

      <button
        onClick={() => {
          if (password === "4321") {   // 🔑 cambiá tu código
            setDevMode(true);
            setShowLogin(false);
            setPassword("");
          } else {
            toast.error("Código incorrecto");
          }
        }}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 8,
          background: "#4CAF50",
          color: "white",
          border: "none",
          marginBottom: 5,
          cursor: "pointer"
        }}
      >
        Ingresar
      </button>

      <button
        onClick={() => {
          setShowLogin(false);
          setPassword("");
        }}
        style={{
          width: "100%",
          padding: 6,
          borderRadius: 8,
          border: "none",
          background: "#ccc",
          cursor: "pointer"
        }}
      >
        Cancelar
      </button>
    </div>
  </div>
)}



      <p style={{ textAlign: "center", color: theme.subText }}>
        {mes}/{anio}
      </p>
      <div style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 15,
  padding: 10,
  borderRadius: 10,
  background: theme.card
}}>

  <span style={{ fontSize: 14 }}>
    🤖 Auto selección
  </span>

  <label style={{
    position: "relative",
    display: "inline-block",
    width: 40,
    height: 20
  }}>

    <input
      type="checkbox"
      checked={autoSeleccion}
      onChange={() => setAutoSeleccion(!autoSeleccion)}
      style={{ opacity: 0, width: 0, height: 0 }}
    />

    <span style={{
      position: "absolute",
      cursor: "pointer",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: autoSeleccion ? "#4CAF50" : "#ccc",
      borderRadius: 20,
      transition: "0.3s"
    }} />

    <span style={{
      position: "absolute",
      height: 16,
      width: 16,
      left: autoSeleccion ? 22 : 2,
      bottom: 2,
      backgroundColor: "white",
      borderRadius: "50%",
      transition: "0.3s"
    }} />

  </label>

</div>

      {/* CATEGORÍAS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>        
        <button style={btn(categoria==="alimentos")} onClick={()=>setCategoria("alimentos")}>🍎 <br/>Alimentos</button>
        <button style={btn(categoria==="limpieza")} onClick={()=>setCategoria("limpieza")}>🧼<br/>Limpieza</button>
        <button style={btn(categoria==="otros")} onClick={()=>setCategoria("otros")}>➕<br/> Otros</button>
        <button style={btn(categoria==="stats")} onClick={()=>setCategoria("stats")}>📊<br/> Stats</button>
      </div>

      
      {/* CONTENIDO */}
      <div key={categoria} style={{
        animation: "fadeSlide 0.25s ease"
      }}>

        {categoria === "otros" ? (
         
<Otros
  otros={otros}
  setOtros={setOtros}
  guardarProductos={guardarProductos}
  devMode={devMode}
/>

        ) : categoria === "stats" ? (
          <Estadisticas stats={stats} productos={productos} />
        ) : (
          <CategoryView
            productos={productos}
            categoria={categoria}
            datos={datos}
            setDatos={setDatos}
            theme={theme}
            devMode={devMode}
          />
        )}

      </div>


      {/* BOTTOM BAR */}
      {/* ✅ BOTTOM BAR PRO */}


<div style={{
  position: "fixed",
  bottom: 0,
  left: "50%",              
  transform: "translateX(-50%)", 
  width: "100%",
  maxWidth: 480,
  display: "flex",
  gap: 10,
  padding: 10,
  background: theme.background,
  borderTop: "1px solid var(--border)",
  zIndex: 1000,      
  boxShadow: "0 -2px 10px rgba(0,0,0,0.2)"
}}>





<button style={actionBtn("#4CAF50")} onClick={guardar}>
  <span style={{
    height: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}>
    💾
  </span>
  <span>Guardar</span>
</button>



  

<button style={actionBtn("#25D366")} onClick={compartir}>
  <span style={{
    height: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}>
    <FaWhatsapp style={{ fontSize: 18 }} />
  </span>
  <span>Enviar</span>
</button>



 

<button style={actionBtn("#2196F3")} onClick={generarPDF}>
  <span style={{
    height: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}>
    📄
  </span>
  <span>PDF</span>
</button>


</div>
<Toaster position="top-center" />
    </div>


  );
}