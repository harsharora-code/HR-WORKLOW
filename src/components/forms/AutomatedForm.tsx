import { useDispatch } from "react-redux";
import { updateNodeData, type WorkflowNode } from "../../features/workflow/slice";
import { useEffect, useState } from "react";
import { getAutomations } from "../../services/api";

type AutomationAction = {
  id: string;
  label: string;
  params: string[];
};

type AutomatedFormProps = {
  node: WorkflowNode;
};

export default function AutomatedForm({ node }: AutomatedFormProps) {
  const dispatch = useDispatch();
  const [actions, setActions] = useState<AutomationAction[]>([]);

  useEffect(() => {
    const fetchActions = async () => {
      const data = await getAutomations();
      setActions(data);
    };
    fetchActions();
  }, []);

  const update = (field: string, value: string) => {
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

  const selectedAction = actions.find((a) => a.id === node.data.actionId);

  const updateParam = (param: string, value: string) => {
    dispatch(
      updateNodeData({
        id: node.id,
        data: {
          ...node.data,
          params: {
            ...node.data.params,
            [param]: value,
          },
        },
      })
    );
  };

  return (
    <div className="form-panel">
      <h2>Automated Step</h2>

      <div>
        <label>Title</label>
        <input
          className="field"
          value={node.data.label || ""}
          onChange={(e) => update("label", e.target.value)}
        />
      </div>

      <div>
        <label>Select Action</label>
        <select
          className="field"
          value={node.data.actionId || ""}
          onChange={(e) =>
            update("actionId", e.target.value)
          }
        >
          <option value="">Select Action</option>
          {actions.map((action) => (
            <option key={action.id} value={action.id}>
              {action.label}
            </option>
          ))}
        </select>
      </div>

      {selectedAction && (
        <div className="form-panel-nested">
          <h3>Parameters</h3>
          {selectedAction.params.map((param: string) => (
            <input
              key={param}
              placeholder={param}
              className="field"
              value={node.data.params?.[param] || ""}
              onChange={(e) =>
                updateParam(param, e.target.value)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
