
export default function App() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#090d18",
      color: "white",
      display: "grid",
      placeItems: "center",
      fontFamily: "Arial"
    }}>
      <div style={{textAlign:"center"}}>
        <h1 style={{color:"#35e69b"}}>🐸 SAPOLANDIA PLAY</h1>
        <h2>Seu portal de jogos</h2>
        <p>Site funcionando corretamente!</p>
        <button style={{
          padding:"15px 30px",
          background:"#35e69b",
          border:0,
          borderRadius:12,
          fontWeight:"bold"
        }}>
          ENTRAR
        </button>
      </div>
    </main>
  );
}
