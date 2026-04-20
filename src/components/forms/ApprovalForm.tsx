import { useDispatch } from "react-redux";
import { updateNodeData, type WorkflowNode } from "../../features/workflow/slice";

type ApprovalFormProps = {
  node: WorkflowNode;
};

export default function ApprovalForm({ node }: ApprovalFormProps) {
  const dispatch = useDispatch();

  const update = (field: string, value: string | number) => {
    dispatch(
      updateNodeData({
        id: node.id,
        data: {
          ...node.data,
          [field]: value,
        },
      })
    );
  };

  return (
    <div className="form-panel">
      <h2>Approval Node</h2>

      <div>
        <label>Title</label>
        <input
          className="field"
          value={node.data.label || ""}
          onChange={(e) => update("label", e.target.value)}
        />
      </div>

      <div>
        <label>Approver Role</label>
        <select
          className="field"
          value={node.data.approverRole || ""}
          onChange={(e) => update("approverRole", e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
        </select>
      </div>

      <div>
        <label>Auto-approve Threshold</label>
        <input
          type="number"
          className="field"
          value={node.data.threshold || ""}
          onChange={(e) =>
            update("threshold", Number(e.target.value))
          }
        />
      </div>
    </div>
  );
}
