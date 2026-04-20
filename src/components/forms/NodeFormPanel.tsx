// components/forms/NodeFormPanel.tsx
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import TaskForm from "./TaskForm";
import ApprovalForm from "./ApprovalForm";
import AutomatedForm from "./AutomatedForm";

export default function NodeFormPanel() {
  const node = useSelector((state: RootState) => state.workflow.selectedNode);

  if (!node) return <div className="empty-panel">Select a node</div>;

  switch (node.data.workflowType) {
    case "task":
      return <TaskForm node={node} />;
    case "approval":
      return <ApprovalForm node={node} />;
    case "automated":
      return <AutomatedForm node={node} />;
    default:
      return <div className="empty-panel">No form for this node</div>;
  }
}
