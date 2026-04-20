import type { DragEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import {
  selectNode,
  setNodes,
  type WorkflowNode,
  type WorkflowType,
} from "../../features/workflow/slice";

const NODE_TYPES = ["start", "task", "approval", "automated", "end"] as const;

const getReactFlowNodeType = (workflowType: WorkflowType) => {
  return workflowType ? "workflowCard" : "default";
};

// components/sidebar/Sidebar.tsx
export default function Sidebar() {
  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.workflow.nodes);

  const onDragStart = (
    event: DragEvent<HTMLButtonElement>,
    type: WorkflowType
  ) => {
    event.dataTransfer.setData("nodeType", type);
    event.dataTransfer.effectAllowed = "move";
  };

  const addNode = (type: WorkflowType) => {
    const newNode: WorkflowNode = {
      id: `${type}-${crypto.randomUUID()}`,
      type: getReactFlowNodeType(type),
      position: {
        x: 160 + nodes.length * 38,
        y: 120 + nodes.length * 24,
      },
      data: {
        label: type,
        workflowType: type,
        nodeKind: "Step",
        owner: "HR",
        trend: "New",
        progress: 25,
        issues: 0,
        completion: "Draft",
        status: "ready",
        metrics: [
          { label: "Queue", value: "0", delta: "+0%" },
          { label: "SLA", value: "TBD", delta: "+0%" },
          { label: "Ready", value: "0", delta: "+0%" },
        ],
      },
    };

    dispatch(setNodes([...nodes, newNode]));
    dispatch(selectNode(newNode));
  };

  return (
    <aside className="node-sidebar">
      <h1 className="panel-title">Workflow nodes</h1>
      {NODE_TYPES.map((type) => (
        <button
          key={type}
          type="button"
          draggable
          onDragStart={(e) => onDragStart(e, type)}
          onClick={() => addNode(type)}
          className="node-palette-item"
          title="Click to add, or drag onto the canvas"
        >
          {type}
        </button>
      ))}
    </aside>
  );
}
