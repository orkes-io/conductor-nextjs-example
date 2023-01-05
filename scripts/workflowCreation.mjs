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
  keyId: "27dbd53d-4483-477d-adaa-6f213c5f7d97",
  keySecret: "7HcRcxXMU6mVnnTuGAOY7S7slTBvWlcHjexQgXHeAvxDDGxB",
  serverUrl: "http://localhost:8080/api",
};

(async () => {
  const clientPromise = orkesConductorClient(playConfig);
  const client = await clientPromise;
  const executor = new WorkflowExecutor(client);
  const wf = createCheckoutWorkflow();
  executor.registerWorkflow(true, wf);  
})();