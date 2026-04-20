// SimulationPanel.tsx
import { useSelector } from "react-redux";
import { simulateWorkflow } from "../../services/api";
import { useState } from "react";
import type { RootState } from "../../app/store";

export default function SimulationPanel() {
  const workflow = useSelector((state: RootState) => state.workflow);
  const [result, setResult] = useState<string[]>([]);

  const run = async () => {
    const res = await simulateWorkflow(workflow);
    setResult(res.steps);
  };

  return (
    <div className="simulation-panel">
      <button onClick={run} className="primary-button">
        Run Simulation
      </button>
      <div className="simulation-results">
        {result.map((r, i) => (
          <div key={i}>{r}</div>
        ))}
      </div>
    </div>
  );
}
