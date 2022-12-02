import { useEffect, useRef, useState } from "react";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import isArray from "lodash/isArray";
import { getProviders, signIn } from "next-auth/react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

interface SignInProps extends AppProps {
  providers: any[];
}

export default function SignIn(props: SignInProps) {
  const { providers } = props;
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const queryError = isArray(router.query.error)
      ? router.query.error[0]
      : router.query.error;

    if (queryError && queryError !== "SessionRequired") {
      console.log(queryError);
      setError("Incorrect username or password.");
    }
  }, [router.query]);

  return (
    <>
      <Typography variant="h3" sx={{ py: 2, fontWeight: 700 }}>
        Sign in
      </Typography>
      <Typography variant="body1" sx={{ pb: 2 }}>
        Use one of the supported sign in methods by clicking on the
        corresponding button. This will forward you to the dedicated sign in
        form of the selected provider.
      </Typography>
      <Paper
        component="form"
        sx={{
          maxWidth: 400,
          px: 2,
          py: 3,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Stack spacing={2} sx={{ width: "100%" }}>
          {error && (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          )}
          <TextField
            inputRef={emailRef}
            label="Email"
            type="email"
            placeholder="Email"
            fullWidth
            error={!!error}
          />
          <TextField
            inputRef={passwordRef}
            label="Password"
            type="password"
            placeholder="Password"
            fullWidth
            error={!!error}
          />

          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <Button
                variant="contained"
                onClick={() =>
                  signIn(provider.id, {
                    email: emailRef?.current?.value,
                    password: passwordRef?.current?.value,
                    callbackUrl: "/",
                  })
                }
              >
                Sign in with {provider.name}
              </Button>
            </div>
          ))}
        </Stack>
      </Paper>
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
