import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import {
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useNotification } from "@/contexts/notification-provider";
import useAxios from "@/hooks/use-axios";

export default function UploadPage() {
  const theme = useTheme();
  const axios = useAxios();
  const nameRef = useRef<HTMLInputElement>();
  const priceRef = useRef<HTMLInputElement>();
  const fileRef = useRef<HTMLInputElement>();
  const [isUploading, setIsUploading] = useState(false);
  const { status } = useSession({ required: true });
  const { showNotification, updateNotification, updateNotificationType } =
    useNotification();

  const uploadListing = async () => {
    const file = fileRef?.current?.files?.[0] ?? { size: -1 };

    if (!file || file.size === -1) {
      return axios.post("/api/invalid/no-file", {}, { baseURL: "/" });
    }

    if (
      file?.size >
      parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE ?? "25000000", 10)
    ) {
      return axios.post("/api/invalid/size", {}, { baseURL: "/" });
    }

    let formData = new FormData();
    formData.append("file", fileRef?.current?.files?.[0] ?? "");
    formData.append("price", priceRef?.current?.value ?? "");
    formData.append("name", nameRef?.current?.value ?? "");
    return axios.post("/listings", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const uploadListingMutation = useMutation(uploadListing, {
    onError: (error: Error | AxiosError) => {
      updateNotificationType("error");

      if (axios.isAxiosError(error)) {
        updateNotification(error?.response?.data.message);
      } else {
        updateNotification("Could not upload file. Please try again.");
      }

      showNotification();
      setIsUploading(false);
    },
    onSuccess: () => {
      updateNotificationType("success");
      updateNotification("Successfully uploaded the file! 🥳");
      showNotification();
      setIsUploading(false);
    },
  });

  const handleUpload = () => {
    setIsUploading(true);
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
        Create listing
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
            inputRef={nameRef}
            label="Title"
            type="text"
            placeholder="Title of the listing"
            disabled={isUploading}
            fullWidth
          />
          <TextField
            inputRef={priceRef}
            label="Price"
            type="number"
            placeholder="Listing price"
            disabled={isUploading}
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
            disabled={isUploading}
          />
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {!isUploading && "Save"}
            {isUploading && <CircularProgress size={24} />}
          </Button>
        </Stack>
      </Paper>
    </>
  );
}
