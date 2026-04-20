// components/canvas/WorkflowCanvas.tsx
import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type Node,
  type NodeMouseHandler,
  type OnEdgesChange,
  type OnNodesChange,
  useReactFlow,
} from "reactflow";
import type { DragEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import {
  setNodes,
  setEdges,
  selectNode,
  type WorkflowNode,
  type WorkflowType,
} from "../../features/workflow/slice";
import { WorkflowCardNode } from "./nodeTypes";

const nodeTypes = {
  workflowCard: WorkflowCardNode,
};

const getReactFlowNodeType = (workflowType: WorkflowType) => {
  return workflowType ? "workflowCard" : "default";
};

const createWorkflowNode = (
  workflowType: WorkflowType,
  position: { x: number; y: number }
): WorkflowNode => ({
  id: `${workflowType}-${crypto.randomUUID()}`,
  type: getReactFlowNodeType(workflowType),
  position,
  data: {
    label: workflowType,
    workflowType,
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
});

export default function WorkflowCanvas() {
  const dispatch = useDispatch();
  const { screenToFlowPosition } = useReactFlow();
  const nodes = useSelector((state: RootState) => state.workflow.nodes) as Node[];
  const edges = useSelector((state: RootState) => state.workflow.edges) as Edge[];

  const onConnect = useCallback(
    (params: Connection) => {
      dispatch(setEdges(addEdge(params, edges)));
    },
    [dispatch, edges]
  );

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    dispatch(selectNode(node));
  }, [dispatch]);

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      dispatch(setNodes(applyNodeChanges(changes, nodes)));
    },
    [dispatch, nodes]
  );

  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      dispatch(setEdges(applyEdgeChanges(changes, edges)));
    },
    [dispatch, edges]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("nodeType") as WorkflowType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = createWorkflowNode(type, position);

      dispatch(setNodes([...nodes, newNode]));
      dispatch(selectNode(newNode));
    },
    [dispatch, nodes, screenToFlowPosition]
  );

  return (
    <main className="workflow-canvas" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={() => dispatch(selectNode(null))}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
      >
        <Background gap={14} size={1} color="#d9e1ea" />
        <MiniMap pannable zoomable />
        <Controls />
      </ReactFlow>
    </main>
  );
}
