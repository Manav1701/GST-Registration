import { useEffect } from "react";
import AppRouter from "./routes/index.jsx";

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FA; color: #1A2235; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #EEF2F7; border-radius: 10px; }
  ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #1B4FD8; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeInUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(27,79,216,0.35);} 50%{box-shadow:0 0 0 8px rgba(27,79,216,0);} }
  @keyframes shake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-6px);} 40%{transform:translateX(6px);} 60%{transform:translateX(-4px);} 80%{transform:translateX(4px);} }
  @keyframes timerPulse { 0%,100%{color:#DC2626;} 50%{color:#F87171;} }
  .field-animate { animation: fadeInUp 0.22s ease both; }
  .otp-box:focus { border-color: #1B4FD8 !important; box-shadow: 0 0 0 3px rgba(27,79,216,0.18) !important; animation: pulse 1.5s infinite; }
  .nav-btn:hover:not(:disabled) { transform: translateY(-1px); }
  .nav-btn { transition: all 0.18s ease; }
`;

export default function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return <AppRouter />;
}
