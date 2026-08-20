import { createRoot } from "react-dom/client";
import "./application.css";
import App from "~/components/App";

// Server-rendered pages such as the password gate have no #root to mount into.
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
