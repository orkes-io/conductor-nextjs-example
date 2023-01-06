import { useState, useEffect, useRef } from "react";
import {
  orkesConductorClient,
  WorkflowExecutor,
  TaskType,
} from "@io-orkes/conductor-javascript";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const useRegistration = () => {
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

  const register = (email) => {
    const makeRegistration = async () => {
      const client = await clientPromise;
      const executor = new WorkflowExecutor(client);
      const executionId = await executor.startWorkflow({
        name: "UserRegistration",
        version: 1,
        input: {
          userEmail: email,
          token: client.token,
        },
        /* correlationId: "myCoolUser", */
      });
      setExecutionId(executionId);
    };
    makeRegistration();
  };

  return {
    register,
    executionStatus,
  };
};
