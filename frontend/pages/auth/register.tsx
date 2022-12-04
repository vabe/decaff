import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useNotification } from "@/contexts/notification-provider";
import useAxios from "@/hooks/use-axios";

export default function RegisterPage() {
  const axios = useAxios();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { showNotification, updateNotification, updateNotificationType } =
    useNotification();

  const signUpUser = async () => {
    return axios.post("/auth/register", {
      name: nameRef?.current?.value,
      email: emailRef?.current?.value,
      password: passwordRef?.current?.value,
    });
  };

  const uploadListingMutation = useMutation(signUpUser, {
    onError: () => {
      setIsLoading(false);
      updateNotificationType("error");
      updateNotification("Could not register. Please try again!");
      showNotification();
    },
    onSuccess: () => {
      setIsLoading(false);
      updateNotificationType("success");
      updateNotification("Success! 🥳 You will be redirected shortly...");
      showNotification();
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 2000);
    },
  });

  const handleSignUpClick = () => {
    setIsLoading(true);
    uploadListingMutation.mutate();
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Typography variant="h3" sx={{ py: 2, fontWeight: 700 }}>
        Sign up
      </Typography>
      <Typography variant="body1" sx={{ pb: 2 }}>
        Use the below form to sign up for using the application! We look forward
        to having you on board with us.
      </Typography>
      <Paper
        component="form"
        sx={{
          px: 2,
          py: 3,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Stack spacing={2} sx={{ width: "100%" }}>
          <TextField
            inputRef={nameRef}
            label="Name"
            type="text"
            placeholder="Claire McDough"
            fullWidth
          />
          <TextField
            inputRef={emailRef}
            label="Email"
            type="email"
            placeholder="Email"
            disabled={isLoading}
            fullWidth
          />
          <TextField
            inputRef={passwordRef}
            label="Password"
            type="password"
            placeholder="Password"
            disabled={isLoading}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleSignUpClick}
            disabled={isLoading}
          >
            Sign up
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
