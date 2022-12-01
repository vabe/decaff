import { useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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

  const listingId = useMemo(() => {
    return router.asPath.split("/").pop();
  }, [router.asPath]);

  const getListing = async (): Promise<Listing> => {
    return axios.get(`/api/listings/${listingId}`).then((res) => res.data);
  };

  const addComment = async () => {
    axios.post(
      `/api/listings/${listingId}/comments`,
      JSON.stringify({
        userId: "123",
        content: commentRef?.current?.value,
        listingId,
      })
    );
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
    onError: () => {
      console.error("ouch");
    },
  });

  const handleGoBackClick = () => {
    router.back();
  };

  const handleBuyClick = () => {
    alert("Buying it");
  };

  const handleCommentClick = () => {
    if (commentRef?.current?.value === "") return;
    commentMutation.mutate();
  };

  if (isLoading) return <SkeletonListing />;
  if (isError) return "Error fetching listings. Please try again later";

  return (
    <Box sx={{ maxWidth: 700 }}>
      <Button onClick={handleGoBackClick} sx={{ alignItems: "center" }}>
        <ArrowBackIcon sx={{ mr: 1, fontSize: 16 }} />
        Go back
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h3">{listing.name}</Typography>
            <Button size="small" onClick={handleBuyClick} variant="contained">
              Buy
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              bgcolor: "primary.main",
              borderRadius: 3,
              height: 250,
              mb: 2,
            }}
          ></Box>
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
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              border: "1px solid rgb(229, 231, 235)",
              boxShadow: "0 2px 5px -4px rgba(0,0,0,0.34)",
              borderRadius: 3,
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
