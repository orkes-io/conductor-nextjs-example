import {
  orkesConductorClient,
  WorkflowExecutor,
  workflow,
  waitTaskDuration,
  generateInlineTask,
  switchTask,
  terminateTask,
} from "@io-orkes/conductor-javascript";

const createCheckoutWorkflow = () =>
  workflow("MyCheckout2", [
    waitTaskDuration("confirmation_wait", "15 seconds"),
    generateInlineTask({
      name: "check_credit",
      inputParameters: {
        products: "${workflow.input.products}",
        totalCredit: "${workflow.input.availableCredit}",
        expression: function ($) {
          return function () {
            var totaAmount = 0;
            for (var i = 0; i < $.products.length; i++) {
              totaAmount = $.products[i].price;
            }
            return totaAmount > $.totalCredit ? "noCredit" : "hasCredit";
          };
        },
      },
    }),
    switchTask("switch_has_credit", "${check_credit_ref.output.result}", {
      noCredit: [
        terminateTask(
          "termination_noCredit",
          "FAILED",
          "User has no credit to complete"
        ),
      ],
      hasCredit: [
        terminateTask(
          "termination_successfull",
          "COMPLETED",
          "User completed checkout successfully"
        ),
      ],
    }),
  ]);

export const playConfig = {
  keyId: process.env.KEY,
  keySecret:process.env.SECRET,
  serverUrl: "http://localhost:3000/api",
};

(async () => {
  const clientPromise = orkesConductorClient(playConfig);
  const client = await clientPromise;
  const executor = new WorkflowExecutor(client);
  const wf = createCheckoutWorkflow();
  executor.registerWorkflow(true, wf);  
})();