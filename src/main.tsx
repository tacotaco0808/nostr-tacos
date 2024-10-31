import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import CssBaseline from "@mui/material/CssBaseline";
import "./style.scss";
createRoot(document.getElementById("root")!).render(
  <>
    {/*リセットcss */}
    <CssBaseline />
    <App />
  </>
);
