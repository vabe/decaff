import { useRouter } from "next/router";
import axios from "axios";
import { isEmpty, isUndefined } from "lodash";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

type ErrorType = {
  statusCode: number;
  message: string;
  error: string;
};

function ErrorText(props: ErrorType) {
  function mapError(error: ErrorType) {
    if (error.message === "User already verified") return error.message;
    if (error.statusCode === 403)
      return "Invalid verification. Please try again with a valid token.";
  }

  return (
    <Typography variant="body1" sx={{ pb: 3 }}>
      {mapError(props)}
    </Typography>
  );
}

export default function EmailVerificationPage({
  prefetchError,
}: ServerSideProps) {
  const router = useRouter();

  if (isEmpty(prefetchError)) {
    setTimeout(() => router.push("/auth/sign-in"), 2000);
  }

  return (
    <Box>
      <Typography variant="h2" sx={{ py: 3 }}>
        Verification
      </Typography>
      {!isEmpty(prefetchError) && <ErrorText {...prefetchError} />}
      {isEmpty(prefetchError) && (
        <Typography variant="body1" sx={{ pb: 2 }}>
          Successful verification! Click the button if you are not forwarded
          automatically.
        </Typography>
      )}
      <Button variant="contained">Go to Sign in page</Button>
    </Box>
  );
}

type ServerSideProps = {
  prefetchError: ErrorType;
};

export async function getServerSideProps(context: any) {
  let error = "";

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URI}/auth/email-verification`,
      {},
      { headers: { Authorization: `Bearer ${context.query.token}` } }
    );
  } catch (e: any) {
    error = e.response.data;
  }

  return {
    props: { prefetchError: error },
  };
}
