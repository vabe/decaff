import { useMemo, useState } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { capitalize } from "lodash";
import { useTheme } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

const uploadListing = async (listing: any) => {
  return axios.post("/api/listings", JSON.stringify(listing));
};

export default function UploadsPage() {
  const theme = useTheme();
  const [notification, setNotification] = useState<string>("");

  const mappedNotification = useMemo(
    () =>
      notification.toLocaleLowerCase().includes("try") ? "error" : "success",
    [notification]
  );

  const uploadListingMutation = useMutation(uploadListing, {
    onError: () => {
      setNotification("Could not upload file. Please try again!");
    },
    onSuccess: () => {
      setNotification("Successfully uploaded the file! 🥳");
    },
  });

  const handleUpload = () => {
    uploadListingMutation.mutate({ id: 3 });
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setNotification("");
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 84px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          borderRadius: 3,
          border: `2px dashed ${theme.palette.primary.main}`,
          width: 640,
          height: 320,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: 48, color: "primary.main", cursor: "pointer" }}>
          <ArrowUpTrayIcon onClick={handleUpload} />
        </Box>
        <Typography sx={{ color: "primary.main" }}>Upload files</Typography>
      </Box>
      <Snackbar
        open={!!notification}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        sx={{
          bottom: 120,
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={mappedNotification}
          sx={{
            width: "100%",
          }}
        >
          <AlertTitle>{capitalize(mappedNotification)}</AlertTitle>
          {notification}
        </Alert>
      </Snackbar>
    </Box>
  );
}
