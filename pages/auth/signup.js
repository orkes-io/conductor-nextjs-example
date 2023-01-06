import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "../../src/Link";
import { useRegistration } from "../../hooks/useRegistration";
import { Grid, TextField, Button, Snackbar, Alert } from "@mui/material";
import Paper from "@mui/material/Paper";
import styles from "../../styles/Home.module.css";

export default function Registration() {
  const [email, setEmail] = useState(null);
  const [registrationDone, setRegistrationDone] = useState([false, "", null]);
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const { register, executionStatus } = useRegistration();

  useEffect(() => {
    if (executionStatus.status === "COMPLETED") {
      setRegistrationDone([true, "User Registered Successfully", true]);
      localStorage.setItem(
        "user_email",
        executionStatus.output.user_application.name
      );
      localStorage.setItem(
        "user_app_id",
        executionStatus.output.user_application.id
      );
    } else if (executionStatus.status === "FAILED") {
      setRegistrationDone([true, executionStatus.reasonForIncompletion, false]);
    }
  }, [executionStatus]);

  return (
    <div className={styles.container}>
      <Head>
        <title>User Registration</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Paper
          variant="outlined"
          sx={{
            height: 600,
            width: 600,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Grid
            container
            justifyContent={"space-around"}
            alignItems="center"
            pl={8}
            spacing={4}
          >
            <Grid item xs={12}>
              Please Register with your email
            </Grid>
            <Grid item xs={6}>
              <TextField
                onChange={handleEmailChange}
                placeholder="Email"
                error={registrationDone[3] === false}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                size="large"
                onClick={() => register(email)}
                variant="outlined"
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={registrationDone[0]}
          autoHideDuration={6000}
          onClose={() => setRegistrationDone([false, "", null])}
        >
          <Alert
            onClose={() => setRegistrationDone([false, "", null])}
            severity={registrationDone[2] ? "success" : "error"}
          >
            {registrationDone[1]}
          </Alert>
        </Snackbar>
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
