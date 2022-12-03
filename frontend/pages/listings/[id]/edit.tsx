import { useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingContent from "@/components/loading-content";
import { useNotification } from "@/contexts/notification-provider";
import useAxios from "@/hooks/use-axios";

export default function ListingPageEdit() {
  const router = useRouter();
  const axios = useAxios();
  const nameRef = useRef<HTMLInputElement>();
  const priceRef = useRef<HTMLInputElement>();

  const { status } = useSession({ required: true });
  const { showNotification, updateNotification } = useNotification();

  const listingId = useMemo(() => {
    return router.query.id;
  }, [router.query.id]);

  const handleGoBackClick = () => {
    router.back();
  };

  const getAccount = async (): Promise<any> => {
    return axios.get("/users/me").then((res) => res.data);
  };

  const getListing = async (): Promise<any> => {
    return axios.get(`/listings/${listingId}`).then((res) => res.data);
  };

  const updateListing = async (): Promise<any> => {
    console.log(listingId);
    return axios.put(
      `/listings/${listingId}`,
      {
        name: nameRef?.current?.value,
        price: parseInt(priceRef?.current?.value ?? "", 10),
      },
      { headers: { "Content-Type": "application/json" } }
    );
  };

  const { data: account, isLoading } = useQuery(
    ["listing-edit-account-me"],
    getAccount
  );

  const { data: listing } = useQuery(["listing"], getListing);
  const updateListingMutation = useMutation(updateListing, {
    onSuccess: () => {
      updateNotification("Success! You will be redirected...");
      showNotification();
      setTimeout(() => router.back(), 2000);
    },
  });

  const handleSave = () => {
    updateListingMutation.mutate();
  };

  if (isLoading) return <LoadingContent />;

  if (account.role !== "ADMIN") {
    router.back();
    return <></>;
  }

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
    <Box sx={{ maxWidth: 700, width: "100%" }}>
      <Button onClick={handleGoBackClick} sx={{ alignItems: "center" }}>
        <ArrowBackIcon sx={{ mr: 1, fontSize: 16 }} />
        Go back
      </Button>

      <Typography variant="h2" sx={{ py: 3 }}>
        Edit listing details
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
            defaultValue={listing?.name}
            label="Title"
            type="text"
            placeholder="Title of the listing"
            fullWidth
          />
          <TextField
            inputRef={priceRef}
            defaultValue={listing?.price}
            label="Price"
            type="number"
            placeholder="Listing price"
            fullWidth
          />
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
