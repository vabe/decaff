import { useMemo, useRef } from "react";
import { useRouter } from "next/router";
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

export default function UserPage() {
  const axios = useAxios();
  const router = useRouter();
  const { status } = useSession({ required: true });
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { showNotification, updateNotification, updateNotificationType } =
    useNotification();

  const userId = useMemo(() => {
    return router.query.id;
  }, [router.query.id]);

  const getUser = async (): Promise<any> => {
    return axios.get(`/users/${userId}`).then((res) => res.data);
  };

  const updateUser = async () => {
    return axios.put(`/users/${userId}`, {
      name: nameRef?.current?.value,
      email: emailRef?.current?.value,
      password: passwordRef?.current?.value,
    });
  };

  const getAccount = async (): Promise<any> => {
    return axios.get("/users/me").then((res) => res.data);
  };

  const { data: account, isLoading: isLoadingAccount } = useQuery(
    ["user-account-me"],
    getAccount
  );

  const updateUserMutation = useMutation(updateUser, {
    onError: () => {
      updateNotificationType("error");
      updateNotification("Could not update user. Please try again!");
      showNotification();
    },
    onSuccess: () => {
      updateNotificationType("success");
      updateNotification("Success! You will be redirected...");
      showNotification();
      setTimeout(() => router.back(), 2000);
    },
  });

  const { data: user, isError, isLoading } = useQuery(["user"], getUser);

  const handleFormSubmit = () => {
    updateUserMutation.mutate();
  };

  if (isLoadingAccount) return <LoadingContent />;

  if (account.role !== "ADMIN") {
    router.back();
    return <></>;
  }

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
  if (isError) return "Error fetching user information. Please try again later";

  return (
    <>
      <Typography variant="h2" sx={{ py: 3 }}>
        Edit user information
      </Typography>
      <Paper
        component="form"
        sx={{
          maxWidth: 400,
          px: 2,
          py: 3,
          pb: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Stack spacing={2} sx={{ width: "100%" }}>
          <TextField
            inputRef={emailRef}
            defaultValue={user.email}
            label="Email"
            type="email"
            placeholder="Email"
            fullWidth
          />
          <TextField
            inputRef={nameRef}
            defaultValue={user.name}
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
