import { Component, type ReactNode } from "react";

/* If WebGL context creation or the scene throws at runtime, the page
   must keep working — swap in the static poster instead of crashing. */
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
