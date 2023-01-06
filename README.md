## Running
To run the app first `yarn` to install dependencies. The app is targeted to node >=18

You'll need the following env variables:

```shell
export SERVER_URL= https://play.orkes.io/api
export KEY=XXXXX-XXXX-XXXX
export SECRET=XXXXX-XXXXX-XXXXX
```
Then Run `yarn dev` to start nextJS server.

*Note* that the app depends on a workflow being created. To create the workflow. in another terminal, with the environment variables exported as well. Run `node scripts/workflowCreation`
