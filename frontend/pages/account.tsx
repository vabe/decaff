import { useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingContent from "@/components/loading-content";
import { useNotification } from "@/contexts/notification-provider";
import useAxios from "@/hooks/use-axios";

export default function AccountPage() {
  const axios = useAxios();
  const { showNotification, updateNotification, updateNotificationType } =
    useNotification();
  const { status } = useSession({ required: true });
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const getAccount = async (): Promise<any> => {
    return axios.get("/users/me").then((res) => res.data);
  };

  const updateAccount = async () => {
    return axios.post("/users/me", {
      name: nameRef?.current?.value,
      email: emailRef?.current?.value,
      password: passwordRef?.current?.value,
    });
  };

  const uploadListingMutation = useMutation(updateAccount, {
    onError: () => {
      updateNotificationType("error");
      updateNotification("Could not update profile. Please try again!");
      showNotification();
    },
    onSuccess: () => {
      updateNotificationType("success");
      updateNotification("Successfully updated the profile! 🥳");
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
            defaultValue={account.email}
            label="Email"
            type="email"
            placeholder="Email"
            fullWidth
          />
          <TextField
            inputRef={nameRef}
            defaultValue={account.name}
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
