import Head from "next/head";
import Link from "../../src/Link";
import { useMyOrders } from "../../hooks/useMyOrders";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Stack } from "@mui/material";
import Paper from "@mui/material/Paper";
import styles from "../../styles/Home.module.css";

export default function MyOrders() {
  const { getOrders, userOrders } = useMyOrders();
  return (
    <div className={styles.container}>
      <Head>
        <title> My Orders</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Stack spacing={2}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Order Id</TableCell>
                  <TableCell align="right">Order Date</TableCell>
                  <TableCell align="right">Amount of Products</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userOrders.map((row) => (
                  <TableRow
                    key={row.workflowId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.workflowId}
                    </TableCell>
                    <TableCell align="right">{row.createdTime}</TableCell>
                    <TableCell align="right">
                      {row.input.products.length}
                    </TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                    <TableCell align="right">
                      {row.reasonForIncompletion}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
        <Link href="/" color="secondary">Back to Home</Link>
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
