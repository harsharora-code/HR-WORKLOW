import { Handle, Position, type NodeProps } from "reactflow";
import type { WorkflowNodeData } from "../../features/workflow/slice";

export function WorkflowCardNode({
  data,
  selected,
}: NodeProps<WorkflowNodeData>) {
  return (
    <div className={`metric-node-card ${selected ? "is-selected" : ""}`}>
      <Handle type="target" position={Position.Left} />
      <div className="metric-node-title">{data.label}</div>
      <div className="metric-node-meta">
        <span>{data.nodeKind ?? "Step"}</span>
        <span>{data.owner ?? "HR"}</span>
        <span>{data.trend ?? "Metric"}</span>
      </div>

      {typeof data.progress === "number" && (
        <div className="metric-progress">
          <span style={{ width: `${data.progress}%` }} />
        </div>
      )}

      <div className="metric-node-footer">
        <span>{data.issues ?? 0} issues</span>
        <span>{data.completion ?? "Ready"}</span>
        <span className={`status-pill status-${data.status ?? "ready"}`}>
          {data.status ?? "ready"}
        </span>
      </div>

      {data.metrics && data.metrics.length > 0 && (
        <div className="metric-grid">
          {data.metrics.map((metric) => (
            <div key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small className={metric.delta.startsWith("-") ? "negative" : ""}>
                {metric.delta}
              </small>
            </div>
          ))}
        </div>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
