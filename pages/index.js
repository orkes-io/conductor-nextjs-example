import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { Grid, Stack, Snackbar, Typography, Alert, Box } from "@mui/material";
import { Product } from "../components/product";
import { PlaceOrderButton } from "../components/placeOrderButton";
import { usePlaceOrder } from "../hooks/usePlaceOrder";
import Link from "../src/Link";
import {
  orkesConductorClient,
} from "@io-orkes/conductor-javascript";
import getConfig from "next/config";

const fakeProducts = [
  { price: 10, title: "Product 1", description: "description product 1" },
  { price: 10, title: "Product 2", description: "description product 2" },
  { price: 10, title: "Product 3", description: "description product 3" },
];
const fakeInitialCredit = 100;

const { publicRuntimeConfig } = getConfig();

export const remove = (idx, sourceArray) => {
  const arrayCopy = sourceArray.slice();
  arrayCopy.splice(idx, 1);
  return arrayCopy;
};

export async function getServerSideProps(context) {
  const clientPromise = orkesConductorClient(publicRuntimeConfig.conductor);
  const client = await clientPromise;
  // With the client pull the workflow with correlationId (correlation id is not really needed it just helps to group orders together)
  return {
    props: {
      conductor: {
        serverUrl: publicRuntimeConfig.conductor.serverUrl,
        TOKEN: client.token,
      },
      workflows: publicRuntimeConfig.workflows,
      correlationId: publicRuntimeConfig.workflows.correlationId,
    },
  };
}
export default function Home({conductor, workflows,correlationId}) {
  const [cartProducts, setProducts] = useState([]);
  const [finishedProduct, setFinishedProduct] = useState(false);
  const { onPlaceOrder, isOrderPlaced, cancelOrder, executionStatus } =
    usePlaceOrder({conductor, workflows,correlationId});

  const handleAddProductToCart = (p) => {
    const maybeProductIdx = cartProducts.findIndex(
      (pro) => pro.title === p.title
    );
    setProducts(
      maybeProductIdx === -1
        ? cartProducts.concat(p)
        : remove(maybeProductIdx, cartProducts)
    );
  };

  const handlePlaceOrder = () => {
    onPlaceOrder(cartProducts, fakeInitialCredit);
  };

  useEffect(() => {
    if (executionStatus?.status === "COMPLETED") {
      setFinishedProduct(true);
      setProducts([]);
    }
  }, [executionStatus]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Checkout Products</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Stack spacing={2}>
          <Grid
            container
            p={4}
            justifyContent="flex-end"
            alignContent={"center"}
            spacing={2}
          >
            <Grid item sx={{ paddingTop: 25 }}>
              <Typography align="center">
                {`Available Credit ${cartProducts.reduce(
                  (acc, { price }) => acc - price,
                  fakeInitialCredit
                )}`}
              </Typography>
            </Grid>

            <Grid item>
              <PlaceOrderButton
                onPlaceOrder={handlePlaceOrder}
                isOrderedPlaced={isOrderPlaced}
                onCancelOrder={cancelOrder}
                orderItems={cartProducts}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            {fakeProducts.map((p) => (
              <Grid item key={p.title}>
                <Product
                  {...p}
                  onAddRemove={() => handleAddProductToCart(p)}
                  notInCart={
                    cartProducts.findIndex((pro) => pro.title === p.title) ===
                    -1
                  }
                />
              </Grid>
            ))}
          </Grid>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={finishedProduct}
            autoHideDuration={6000}
            onClose={() => setFinishedProduct(false)}
          >
            <Alert onClose={() => setFinishedProduct(false)}>
              Checkout Successful
            </Alert>
          </Snackbar>
          <Box pl={1}>
            <Link href="/orders/my-orders" color="secondary">
              View My Orders
            </Link>
          </Box>
        </Stack>
      </main>

      <footer></footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
