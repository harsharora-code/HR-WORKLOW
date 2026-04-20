// features/workflow/workflowSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { MarkerType, type Edge, type Node } from "reactflow";

export type WorkflowType = "start" | "task" | "approval" | "automated" | "end";

export type WorkflowNodeData = {
  label?: string;
  workflowType?: WorkflowType;
  nodeKind?: string;
  owner?: string;
  trend?: string;
  progress?: number;
  issues?: number;
  completion?: string;
  status?: "ready" | "progress" | "done" | "risk";
  metrics?: Array<{
    label: string;
    value: string;
    delta: string;
  }>;
  assignee?: string;
  approverRole?: string;
  threshold?: number;
  actionId?: string;
  params?: Record<string, string>;
} & Record<string, unknown>;
export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

type WorkflowState = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNode: WorkflowNode | null;
};

type UpdateNodeDataPayload = {
  id: string;
  data: WorkflowNodeData;
};

const initialNodes: WorkflowNode[] = [
  {
    id: "start-1",
    type: "workflowCard",
    position: { x: -520, y: -210 },
    data: {
      label: "New hire request",
      workflowType: "start",
      nodeKind: "Intake",
      owner: "Recruiting",
      trend: "Form",
      progress: 68,
      issues: 2,
      completion: "67% done",
      status: "progress",
      metrics: [
        { label: "Open", value: "18", delta: "+12%" },
        { label: "SLA", value: "2.4d", delta: "-8%" },
        { label: "Ready", value: "11", delta: "+21%" },
      ],
    },
  },
  {
    id: "task-1",
    type: "workflowCard",
    position: { x: -190, y: -110 },
    data: {
      label: "Collect employee details",
      workflowType: "task",
      nodeKind: "Task",
      owner: "People Ops",
      trend: "Input",
      progress: 82,
      issues: 1,
      completion: "82% done",
      status: "progress",
      metrics: [
        { label: "Past 7 days", value: "42", delta: "+8%" },
        { label: "Past 5 weeks", value: "188", delta: "+15%" },
        { label: "Past 12 months", value: "2,104", delta: "+31%" },
      ],
    },
  },
  {
    id: "task-2",
    type: "workflowCard",
    position: { x: -190, y: 120 },
    data: {
      label: "Background verification",
      workflowType: "task",
      nodeKind: "Vendor check",
      owner: "Compliance",
      trend: "Average",
      progress: 50,
      issues: 4,
      completion: "50% done",
      status: "risk",
      metrics: [
        { label: "MTD", value: "26", delta: "-10%" },
        { label: "QTD", value: "93", delta: "-4%" },
        { label: "YTD", value: "708", delta: "+6%" },
      ],
    },
  },
  {
    id: "approval-1",
    type: "workflowCard",
    position: { x: 230, y: 8 },
    data: {
      label: "Manager approval",
      workflowType: "approval",
      nodeKind: "Decision",
      owner: "North Star",
      trend: "Gate",
      progress: 74,
      issues: 0,
      completion: "Ready",
      status: "ready",
      metrics: [
        { label: "Approved", value: "74%", delta: "+6%" },
        { label: "Waiting", value: "19", delta: "-11%" },
        { label: "Rejected", value: "7", delta: "-3%" },
      ],
    },
  },
  {
    id: "automated-1",
    type: "workflowCard",
    position: { x: 650, y: -150 },
    data: {
      label: "Provision accounts",
      workflowType: "automated",
      nodeKind: "Automation",
      owner: "IT",
      trend: "Runbook",
      progress: 99,
      issues: 0,
      completion: "99% done",
      status: "done",
      metrics: [
        { label: "Past 7 days", value: "38", delta: "+4%" },
        { label: "Past 5 weeks", value: "196", delta: "+18%" },
        { label: "Past 12 months", value: "2,358", delta: "+37%" },
      ],
    },
  },
  {
    id: "automated-2",
    type: "workflowCard",
    position: { x: 650, y: 90 },
    data: {
      label: "Send welcome packet",
      workflowType: "automated",
      nodeKind: "Automation",
      owner: "HRIS",
      trend: "Message",
      progress: 96,
      issues: 1,
      completion: "96% done",
      status: "done",
      metrics: [
        { label: "Emails", value: "41", delta: "+9%" },
        { label: "Docs", value: "39", delta: "+13%" },
        { label: "Signed", value: "34", delta: "+25%" },
      ],
    },
  },
  {
    id: "end-1",
    type: "workflowCard",
    position: { x: 1010, y: -25 },
    data: {
      label: "Employee ready for day one",
      workflowType: "end",
      nodeKind: "Outcome",
      owner: "HR",
      trend: "Metric",
      progress: 88,
      issues: 0,
      completion: "88% ready",
      status: "ready",
      metrics: [
        { label: "Ready", value: "35", delta: "+16%" },
        { label: "Blocked", value: "3", delta: "-25%" },
        { label: "On time", value: "91%", delta: "+7%" },
      ],
    },
  },
];

const initialEdges: WorkflowEdge[] = [
  {
    id: "start-task",
    source: "start-1",
    target: "task-1",
    type: "smoothstep",
    label: "0.982",
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#31ad73", strokeWidth: 2 },
    labelStyle: { fill: "#ffffff", fontWeight: 700 },
    labelBgStyle: { fill: "#31ad73" },
  },
  {
    id: "start-check",
    source: "start-1",
    target: "task-2",
    type: "smoothstep",
    label: "0.644",
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#d84a4a", strokeWidth: 2, strokeDasharray: "5 5" },
    labelStyle: { fill: "#ffffff", fontWeight: 700 },
    labelBgStyle: { fill: "#d84a4a" },
  },
  {
    id: "task-approval",
    source: "task-1",
    target: "approval-1",
    type: "smoothstep",
    label: "0.998",
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#31ad73", strokeWidth: 2 },
    labelStyle: { fill: "#ffffff", fontWeight: 700 },
    labelBgStyle: { fill: "#31ad73" },
  },
  {
    id: "check-approval",
    source: "task-2",
    target: "approval-1",
    type: "smoothstep",
    label: "0.721",
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#31ad73", strokeWidth: 2 },
    labelStyle: { fill: "#ffffff", fontWeight: 700 },
    labelBgStyle: { fill: "#31ad73" },
  },
  {
    id: "approval-accounts",
    source: "approval-1",
    target: "automated-1",
    type: "smoothstep",
    label: "0.999",
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#31ad73", strokeWidth: 2 },
    labelStyle: { fill: "#ffffff", fontWeight: 700 },
    labelBgStyle: { fill: "#31ad73" },
  },
  {
    id: "approval-welcome",
    source: "approval-1",
    target: "automated-2",
    type: "smoothstep",
    label: "0.998",
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#31ad73", strokeWidth: 2 },
    labelStyle: { fill: "#ffffff", fontWeight: 700 },
    labelBgStyle: { fill: "#31ad73" },
  },
  {
    id: "accounts-end",
    source: "automated-1",
    target: "end-1",
    type: "smoothstep",
    label: "0.388",
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#9ccdb3", strokeWidth: 2, strokeDasharray: "4 4" },
    labelStyle: { fill: "#ffffff", fontWeight: 700 },
    labelBgStyle: { fill: "#5fb986" },
  },
  {
    id: "welcome-end",
    source: "automated-2",
    target: "end-1",
    type: "smoothstep",
    label: "0.998",
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#31ad73", strokeWidth: 2 },
    labelStyle: { fill: "#ffffff", fontWeight: 700 },
    labelBgStyle: { fill: "#31ad73" },
  },
];

const initialState: WorkflowState = {
  nodes: initialNodes,
  edges: initialEdges,
  selectedNode: null,
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<WorkflowNode[]>) => {
      state.nodes = action.payload;
      if (state.selectedNode) {
        state.selectedNode =
          action.payload.find((node) => node.id === state.selectedNode?.id) ??
          null;
      }
    },
    setEdges: (state, action: PayloadAction<WorkflowEdge[]>) => {
      state.edges = action.payload;
    },
    selectNode: (state, action: PayloadAction<WorkflowNode | null>) => {
      state.selectedNode = action.payload;
    },
    updateNodeData: (state, action: PayloadAction<UpdateNodeDataPayload>) => {
      const { id, data } = action.payload;
      const node = state.nodes.find((n) => n.id === id);
      if (node) node.data = data;
      if (state.selectedNode?.id === id) {
        state.selectedNode = {
          ...state.selectedNode,
          data,
        };
      }
    },
  },
});

export const { setNodes, setEdges, selectNode, updateNodeData } =
  workflowSlice.actions;

export default workflowSlice.reducer;
