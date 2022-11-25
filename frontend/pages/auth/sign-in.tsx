import { AppProps } from "next/app";
import { getProviders, signIn } from "next-auth/react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface SignInProps extends AppProps {
  providers: any[];
}

export default function SignIn(props: SignInProps) {
  const { providers } = props;

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
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <Button
            size="small"
            variant="contained"
            onClick={() => signIn(provider.id)}
          >
            Sign in with {provider.name}
          </Button>
        </div>
      ))}
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
