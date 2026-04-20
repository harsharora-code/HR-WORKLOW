// services/api.ts
import type { WorkflowNode } from "../features/workflow/slice";

type AutomationAction = {
  id: string;
  label: string;
  params: string[];
};

type WorkflowSimulationInput = {
  nodes: WorkflowNode[];
  edges: Array<{
    source: string;
    target: string;
  }>;
};

type WorkflowSimulationResult = {
  steps: string[];
};

export const getAutomations = async (): Promise<AutomationAction[]> => [
  { id: "send_email", label: "Send Email", params: ["to", "subject", "body"] },
  { id: "generate_doc", label: "Generate Doc", params: ["template"] },
];

const getOrderedNodes = (workflow: WorkflowSimulationInput) => {
  const nodeById = new Map(workflow.nodes.map((node) => [node.id, node]));
  const targets = new Set(workflow.edges.map((edge) => edge.target));
  const startNode =
    workflow.nodes.find((node) => node.data.workflowType === "start") ??
    workflow.nodes.find((node) => !targets.has(node.id)) ??
    workflow.nodes[0];

  if (!startNode) return [];

  const ordered: WorkflowNode[] = [];
  const visited = new Set<string>();
  const queue = [startNode.id];

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (!nodeId || visited.has(nodeId)) continue;

    const node = nodeById.get(nodeId);
    if (!node) continue;

    visited.add(nodeId);
    ordered.push(node);

    workflow.edges
      .filter((edge) => edge.source === nodeId)
      .forEach((edge) => queue.push(edge.target));
  }

  workflow.nodes.forEach((node) => {
    if (!visited.has(node.id)) ordered.push(node);
  });

  return ordered;
};

const runAutomation = (node: WorkflowNode) => {
  const actionId = node.data.actionId;
  const params = node.data.params ?? {};

  if (!actionId) {
    return `Skipped "${node.data.label}": no automation action selected`;
  }

  if (actionId === "send_email") {
    const missingFields = ["to", "subject", "body"].filter(
      (field) => !params[field]?.trim()
    );

    if (missingFields.length > 0) {
      return `Email not sent from "${node.data.label}": missing ${missingFields.join(", ")}`;
    }

    return `Email sent to ${params.to}: "${params.subject}"`;
  }

  if (actionId === "generate_doc") {
    if (!params.template?.trim()) {
      return `Document not generated from "${node.data.label}": missing template`;
    }

    return `Document generated from template "${params.template}"`;
  }

  return `Ran automation "${actionId}" from "${node.data.label}"`;
};

export const simulateWorkflow = async (
  workflow: WorkflowSimulationInput
): Promise<WorkflowSimulationResult> => {
  const orderedNodes = getOrderedNodes(workflow);

  return {
    steps: orderedNodes.map((node) => {
      if (node.data.workflowType === "automated") {
        return runAutomation(node);
      }

      return `Completed ${node.data.label ?? node.data.workflowType ?? node.type}`;
    }),
  };
};
