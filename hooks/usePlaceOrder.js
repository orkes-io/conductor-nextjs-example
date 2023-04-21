import { useState, useEffect, useRef } from "react";
import {
  orkesConductorClient,
  WorkflowExecutor,
} from "@io-orkes/conductor-javascript";

export const usePlaceOrder = ({ conductor, workflows, correlationId }) => {
  const timerRef = useRef(null);
  const [executionId, setExecutionId] = useState(null);
  const [executionStatus, setExecutionStatus] = useState({});
  // Create the client with our properties in the next file
  const clientPromise = orkesConductorClient(conductor);

  useEffect(() => {
    // Made a interval effect that will start running when we have an executionId
    const queryStatus = async () => {
      const client = await clientPromise;
      // Using executionId query for status
      const workflowStatus = await client.workflowResource.getExecutionStatus(
        executionId,
        true
      );
      setExecutionStatus(workflowStatus);
      // If workflow finished clear interval and clean executionId
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
      // Create an instance of a workflow executor
      const executor = new WorkflowExecutor(client);
      // using the executor helper start the workflow
      const executionId = await executor.startWorkflow({
        name: workflows.checkout,
        version: 1,
        input: {
          products,
          availableCredit: availableBalance,
        },
        correlationId,
      });
      // persist executionId in state
      setExecutionId(executionId);
    };
    placeOrder();
  };

  const cancelOrder = () => {
    const cancelOrderInner = async () => {
      const client = await clientPromise;
      //create an instance of the executor and cancel the running workflow
      const executor = new WorkflowExecutor(client);
      executor.terminate(executionId, "User cancelled order");
      // clean the executor id. and clear the timer
      setExecutionId(null);
      clearTimeout(timerRef.current);
    };

    cancelOrderInner();
  };

  return {
    onPlaceOrder: handlePlaceOrder,
    isOrderPlaced: executionId != null,
    cancelOrder,
    executionStatus,
  };
};
