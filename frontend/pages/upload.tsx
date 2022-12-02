import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNotification } from "@/contexts/notification-provider";
import useAxios from "@/hooks/use-axios";

export default function UploadPage() {
  const theme = useTheme();
  const axios = useAxios();
  const { data: session, status } = useSession({ required: true });
  const { showNotification, updateNotification } = useNotification();

  const uploadListing = async (listing: any) => {
    return axios.post("/listings", JSON.stringify(listing));
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
    uploadListingMutation.mutate({ id: 3 });
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

  console.log(session);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          borderRadius: 3,
          border: `2px dashed ${theme.palette.primary.main}`,
          maxWidth: 640,
          minWidth: 320,
          height: 320,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleUpload}
      >
        <Box sx={{ width: 48, color: "primary.main" }}>
          <ArrowUpTrayIcon />
        </Box>
        <Typography sx={{ color: "primary.main" }}>Upload files</Typography>
      </Box>
    </Box>
  );
}
