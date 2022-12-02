import { useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useNotification } from "@/contexts/notification-provider";
import useAxios from "@/hooks/use-axios";

function LoadingContent() {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress color="primary" size={42} />
    </Box>
  );
}

export default function AccountPage() {
  const axios = useAxios();
  const { showNotification, updateNotification } = useNotification();
  const { status } = useSession({ required: true });
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const getAccount = async (): Promise<any> => {
    return axios.get("/account").then((res) => res.data);
  };

  const updateAccount = async () => {
    return axios.post(
      "/account",
      JSON.stringify({
        name: nameRef?.current?.value,
        email: emailRef?.current?.value,
        password: passwordRef?.current?.value,
      })
    );
  };

  const uploadListingMutation = useMutation(updateAccount, {
    onError: () => {
      updateNotification("Could not upload file. Please try again!");
      showNotification();
    },
    onSuccess: () => {
      updateNotification("Successfully uploaded the file! 🥳");
      showNotification();
    },
  });

  const {
    data: account,
    isError,
    isLoading,
  } = useQuery(["account"], getAccount);

  const handleFormSubmit = () => {
    uploadListingMutation.mutate();
  };

  if (status !== "authenticated")
    return (
      <>
        <Typography variant="h3" sx={{ py: 2, fontWeight: 700 }}>
          Forbidden
        </Typography>
        <Typography variant="body1">
          You will be forwarded to the sign in page.
        </Typography>
      </>
    );
  if (isLoading) return <LoadingContent />;
  if (isError)
    return "Error fetching account information. Please try again later";

  return (
    <>
      <Typography variant="h2" sx={{ py: 3 }}>
        Account
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
          <TextField
            inputRef={emailRef}
            value={account.email}
            label="Email"
            type="email"
            placeholder="Email"
            fullWidth
          />
          <TextField
            inputRef={nameRef}
            value={account.name}
            label="Name"
            type="text"
            placeholder="Name"
            fullWidth
          />
          <TextField
            inputRef={passwordRef}
            label="Password"
            type="password"
            placeholder="Password"
            fullWidth
          />

          <Button variant="contained" onClick={handleFormSubmit}>
            Save
          </Button>
        </Stack>
      </Paper>
    </>
  );
}
