export default function SearchBar({ value, onChange }) {
  return (
    <div style={{
      position: "relative",
      width: "100%"
    }}>

      {/* 🔍 ICONO */}
      <span style={{
        position: "absolute",
        left: 12,
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: 16,
        opacity: 0.6,
        pointerEvents: "none" // ✅ evita que moleste
      }}>
        🔍
      </span>

      {/* ✅ INPUT */}
      <input
        value={value}
        placeholder="Buscar producto..."
        onChange={e => onChange(e.target.value)}

        
onFocus={(e) => {
  // ✅ borde verde
  e.target.style.boxShadow = "0 0 0 2px #4CAF50";

  // ✅ scroll automático
  setTimeout(() => {
    e.target.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 300);
}}


        onBlur={e => {
          e.target.style.boxShadow = "none";
        }}

        style={{
          width: "100%",
          padding: "12px 40px",
          borderRadius: 12,
          border: "none",
          background: "transparent", // ✅ el fondo lo maneja el contenedor padre
          color: "inherit",          // ✅ se adapta a dark/light
          fontFamily: "var(--sans)",
          boxSizing: "border-box",
          outline: "none",
          fontSize: 14,
          transition: "box-shadow 0.2s ease",
          boxSizing: "border-box"
        }}
      />

      {/* ❌ BOTÓN BORRAR */}
      {value && (
        <button
          onClick={() => onChange("")}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            fontSize: 16,
            cursor: "pointer",
            opacity: 0.6
          }}
        >
          ✖
        </button>
      )}

    </div>
  );
}
