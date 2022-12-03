import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Button, Paper, Stack, TextField, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useNotification } from "@/contexts/notification-provider";
import useAxios from "@/hooks/use-axios";

export default function UploadPage() {
  const theme = useTheme();
  const axios = useAxios();
  const nameRef = useRef<HTMLInputElement>();
  const priceRef = useRef<HTMLInputElement>();
  const fileRef = useRef<HTMLInputElement>();
  const { status } = useSession({ required: true });
  const { showNotification, updateNotification } = useNotification();

  const uploadListing = async () => {
    let formData = new FormData();
    formData.append("file", fileRef?.current?.files?.[0] ?? "");
    formData.append("price", priceRef?.current?.value ?? "");
    formData.append("name", nameRef?.current?.value ?? "");
    return axios.post("/listings", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const uploadListingMutation = useMutation(uploadListing, {
    onError: () => {
      updateNotification("Could not upload file. Please try again!");
      showNotification();
    },
    onSuccess: () => {
      updateNotification("Successfully uploaded the file! 🥳");
      showNotification();
    },
  });

  const handleUpload = () => {
    uploadListingMutation.mutate();
  };

  if (status !== "authenticated") {
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
  }

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
            inputRef={nameRef}
            label="Title"
            type="text"
            placeholder="Title of the listing"
            fullWidth
          />
          <TextField
            inputRef={priceRef}
            label="Price"
            type="number"
            placeholder="Listing price"
            fullWidth
          />

          <TextField
            inputRef={fileRef}
            type="file"
            hidden
            sx={{
              borderRadius: 3,
              border: `2px dashed ${theme.palette.primary.main}`,
            }}
          />
          <Button variant="contained" onClick={handleUpload}>
            Save
          </Button>
        </Stack>
      </Paper>
    </>
  );
}
