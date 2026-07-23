import { Component, type ReactNode } from "react";

/* If WebGL context creation or the scene throws, keep the page usable by
   swapping in the static fallback instead of crashing. */
export class SceneErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
