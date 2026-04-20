// App.tsx
import WorkflowCanvas from "./components/canvas/WorkflowCanvas";
import Sidebar from "./components/sidebar/Sidebar";
import NodeFormPanel from "./components/forms/NodeFormPanel";
import SimulationPanel from "./components/sandbox/SimulationPanel";

export default function App() {
  return (
    <div className="app-shell">
      <header className="canvas-header">
        <div>
          <span className="eyebrow">Example</span>
          <strong>HR onboarding workflow</strong>
        </div>
        <div className="canvas-tab">Canvas</div>
      </header>

      <section className="canvas-workspace">
        <WorkflowCanvas />
        <div className="palette-dock">
          <Sidebar />
        </div>
        <aside className="inspector-panel">
          <NodeFormPanel />
          <SimulationPanel />
        </aside>
      </section>
    </div>
  );
}
