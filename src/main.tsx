import { Component, StrictMode } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Rendering failed.", error, info.componentStack); }
  render() {
    if (this.state.failed) {
      return (
        <main className="flex min-h-dvh items-center justify-center p-8">
          <div className="panel max-w-md p-8">
            <h1 className="text-xl font-black">The agency hit a rendering error.</h1>
            <button className="primary-button mt-5" onClick={() => window.location.reload()}>Reload agency</button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

const root = document.getElementById("root");
if (!root) throw new Error("Missing application root.");
createRoot(root).render(<StrictMode><ErrorBoundary><App /></ErrorBoundary></StrictMode>);
