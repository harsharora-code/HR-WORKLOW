// TaskForm.tsx
import { useDispatch } from "react-redux";
import { updateNodeData, type WorkflowNode } from "../../features/workflow/slice";

export default function TaskForm({ node }: { node: WorkflowNode }) {
  const dispatch = useDispatch();

  const update = (field: string, value: unknown) => {
    dispatch(updateNodeData({
      id: node.id,
      data: { ...node.data, [field]: value }
    }));
  };

  return (
    <div className="form-panel">
      <h2>Task Node</h2>
      <label>
        Title
      </label>
      <input
        className="field"
        value={node.data.label || ""}
        onChange={(e) => update("label", e.target.value)}
      />
      <label>
        Assignee
      </label>
      <input
        className="field"
        placeholder="Assignee"
        value={node.data.assignee || ""}
        onChange={(e) => update("assignee", e.target.value)}
      />
    </div>
  );
}
