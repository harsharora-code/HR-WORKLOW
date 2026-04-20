// services/api.ts
import type { WorkflowNode } from "../features/workflow/slice";

type AutomationAction = {
  id: string;
  label: string;
  params: string[];
};

type WorkflowSimulationInput = {
  nodes: WorkflowNode[];
};

type WorkflowSimulationResult = {
  steps: string[];
};

export const getAutomations = async (): Promise<AutomationAction[]> => [
  { id: "send_email", label: "Send Email", params: ["to", "subject"] },
  { id: "generate_doc", label: "Generate Doc", params: ["template"] },
];

export const simulateWorkflow = async (
  workflow: WorkflowSimulationInput
): Promise<WorkflowSimulationResult> => {
  return {
    steps: workflow.nodes.map((n) => `Executed ${n.data.workflowType ?? n.type}`),
  };
};
