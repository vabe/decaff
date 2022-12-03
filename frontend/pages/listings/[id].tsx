import { KeyboardEvent, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Listing } from "@/../mocks/types";
import Comment from "@/components/comment";
import { useNotification } from "@/contexts/notification-provider";
import createPreviewFromBuffer from "@/utils/create-image-buffer";

const ERROR_ALREADY_PURCHASED = "You can only buy the listing once.";
const ERROR_CANNOT_PURCHASE =
  "Could not purchase file. Please try again later!";

function mapError(error: string) {
  switch (error) {
    case ERROR_ALREADY_PURCHASED:
      return ERROR_ALREADY_PURCHASED;
    default:
      return ERROR_CANNOT_PURCHASE;
  }
}

function SkeletonListing() {
  return (
    <Box sx={{ maxWidth: 700 }}>
      <Button onClick={() => {}} sx={{ alignItems: "center" }}>
        <ArrowBackIcon sx={{ mr: 1, fontSize: 16 }} />
        <Skeleton variant="rounded" width={210} height={24} />
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3">
            <Skeleton variant="rounded" width={210} height={60} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rounded" height={250} sx={{ mb: 2 }} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            <Skeleton variant="rounded" height={200} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" width={60} height={32} />
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rounded" height={50} sx={{ my: 1 }} />
        </Grid>
        <Grid item xs={12}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              height={120}
              sx={{ my: 1 }}
            />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default function ListingPage() {
  const router = useRouter();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const { showNotification, updateNotification, updateNotificationType } =
    useNotification();

  const listingId = useMemo(() => {
    return router.asPath.split("/").pop();
  }, [router.asPath]);

  const getListing = async (): Promise<Listing> => {
    return axios.get(`/listings/${listingId}`).then((res) => res.data);
  };

  const addComment = async () => {
    return axios.post(`/listings/${listingId}/comments`, {
      content: commentRef?.current?.value,
    });
  };

  const addHistoryItem = async () => {
    return axios.post("/history", { listingId });
  };

  const {
    data: listing,
    isError,
    isLoading,
  } = useQuery(["listing"], getListing);

  const commentMutation = useMutation(addComment, {
    onSuccess: () => {
      if (commentRef?.current?.value) commentRef.current.value = "";
      queryClient.invalidateQueries(["listing"]);
    },
    onError: (error: AxiosError) => {
      console.error(error?.response?.statusText);
    },
  });

  const historyMutation = useMutation(addHistoryItem, {
    onError: (error: Error | AxiosError) => {
      updateNotificationType("error");

      if (axios.isAxiosError(error)) {
        updateNotification(mapError(error?.response?.data.message));
      } else {
        updateNotification(ERROR_CANNOT_PURCHASE);
      }

      showNotification();
    },
    onSuccess: () => {
      updateNotification("Successfully purchased the file! 🥳");
      showNotification();
    },
  });

  const previewBuffer = useMemo(
    () => createPreviewFromBuffer(listing?.media?.preview),
    [listing?.media?.preview]
  );

  const sendComment = () => {
    if (commentRef?.current?.value === "") return;
    commentMutation.mutate();
  };

  const handleGoBackClick = () => {
    router.back();
  };

  const handleBuyClick = () => {
    historyMutation.mutate();
  };

  const handleCommentClick = () => {
    sendComment();
  };

  const handleCommentKeyboard = (
    event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (event.key === "Enter" && event.ctrlKey) {
      sendComment();
    }
  };

  if (isLoading) return <SkeletonListing />;
  if (isError) return "Error fetching listings. Please try again later";

  return (
    <Box sx={{ maxWidth: 700, width: "100%" }}>
      <Button onClick={handleGoBackClick} sx={{ alignItems: "center" }}>
        <ArrowBackIcon sx={{ mr: 1, fontSize: 16 }} />
        Go back
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6" sx={{ wordWrap: "break-word" }}>
              {listing.name}
            </Typography>
            {status === "authenticated" && (
              <Button size="small" onClick={handleBuyClick} variant="contained">
                Buy
              </Button>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              borderRadius: 3,
              mb: 2,
              display: "flex",
              overflow: "hidden",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewBuffer} alt={listing.caption} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{listing.caption}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box>
            {listing.tags?.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ mb: 1, mr: 1 }}
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12}>
          {status === "authenticated" && (
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <InputBase
                inputRef={commentRef}
                multiline
                sx={{ ml: 2, flex: 1 }}
                placeholder="Type your comments here"
                inputProps={{ "aria-label": "search google maps" }}
                fullWidth
                maxRows={5}
                onKeyUp={handleCommentKeyboard}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton
                color="primary"
                sx={{ p: "10px" }}
                aria-label="directions"
                onClick={handleCommentClick}
              >
                <SendIcon />
              </IconButton>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12}>
          {listing.comments?.map((comment) => (
            <Comment key={comment.id} {...comment} />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}
