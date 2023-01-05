import { useState, useEffect, useRef } from "react";
import {
  orkesConductorClient,
  WorkflowExecutor,
  TaskType,
} from "@io-orkes/conductor-javascript";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
export const usePlaceOrder = () => {
  const timerRef = useRef(null);
  const [executionId, setExecutionId] = useState(null);
  const [executionStatus, setExecutionStatus] = useState({});
  const clientPromise = orkesConductorClient(publicRuntimeConfig.conductor);

  useEffect(() => {
    const queryStatus = async () => {
      const client = await clientPromise;
      const workflowStatus = await client.workflowResource.getExecutionStatus(
        executionId,
        true
      );
      setExecutionStatus(workflowStatus);
      if (
        ["COMPLETED", "FAILED", "TERMINATED"].includes(workflowStatus.status)
      ) {
        clearTimeout(timerRef.current);
        setExecutionId(null);
      }
    };
    if (executionId) {
      timerRef.current = setInterval(() => {
        queryStatus();
      }, 1000);
    }
  }, [executionId]);

  useEffect(() => {
    return clearTimeout(timerRef.current);
  }, []);

  const handlePlaceOrder = (products, availableBalance) => {
    const placeOrder = async () => {
      const client = await clientPromise;
      const executor = new WorkflowExecutor(client);
      const executionId = await executor.startWorkflow({
        name: publicRuntimeConfig.workflows.checkout,
        version: 1,
        input: {
          products,
          availableCredit: availableBalance,
        },
        correlationId: "myCoolUser",
      });
      setExecutionId(executionId);
    };
    placeOrder();
  };

  const cancelOrder = () => {
    const placeOrder = async () => {
      const client = await clientPromise;
      const executor = new WorkflowExecutor(client);
      executor.terminate(executionId, "User cancelled order");
      setExecutionId(null);
    };

    placeOrder();
  };

  return {
    onPlaceOrder: handlePlaceOrder,
    isOrderPlaced: executionId != null,
    cancelOrder,
    executionStatus,
  };
};
