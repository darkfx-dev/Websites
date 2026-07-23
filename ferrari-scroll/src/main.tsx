import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import "./index.css";
import App from "./App.tsx";
import { SceneErrorBoundary } from "./components/cinematic/SceneErrorBoundary";
import { StaticExperience } from "./components/fallback/StaticExperience";
import { easeCine } from "./lib/motion";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={{ ease: easeCine }}>
        {/* If the cinematic path ever throws, fall back to the readable static
            experience instead of a blank page. */}
        <SceneErrorBoundary fallback={<StaticExperience />}>
          <App />
        </SceneErrorBoundary>
      </MotionConfig>
    </LazyMotion>
  </StrictMode>,
);
