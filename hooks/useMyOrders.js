import { useState, useEffect, useRef } from "react";
import {
  orkesConductorClient,
  WorkflowExecutor,
  TaskType,
} from "@io-orkes/conductor-javascript";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const useMyOrders = () => {
  const [userOrders, setOrders] = useState([]);
  const clientPromise = orkesConductorClient(publicRuntimeConfig.conductor);

  const handleGetMyOrders = () => {
    const getOrders = async () => {
      const client = await clientPromise;
      const orders = await client.workflowResource.getWorkflows1(
        publicRuntimeConfig.workflows.checkout,
        "myCoolUser",
        true // include terminated
      );
      setOrders(orders);
    };
    getOrders();
  };

  useEffect(()=>{
    handleGetMyOrders();
  },[])

  return { getOrders: handleGetMyOrders, userOrders };
};
