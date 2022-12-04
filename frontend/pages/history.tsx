import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ItemCard from "@/components/item-card";
import useAxios from "@/hooks/use-axios";
import { History, Listing } from "../mocks/types";

function SkeletonListing() {
  return (
    <Card>
      <CardContent sx={{ pb: 0 }}>
        <Stack spacing={1}>
          <Skeleton variant="rounded" height={175} />
          <Typography gutterBottom variant="h5" component="div">
            <Skeleton variant="text" />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </Typography>
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rounded" width="100%" height={10} />
            <Skeleton variant="rounded" width="100%" height={10} />
            <Skeleton variant="rounded" width="100%" height={10} />
          </Stack>
        </Stack>
      </CardContent>

      <CardActions>
        <Skeleton variant="rounded" width={120} height={32} />
      </CardActions>
    </Card>
  );
}

function SkeletonListings() {
  return (
    <>
      <Typography variant="h3" sx={{ py: 2 }}>
        History
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <SkeletonListing />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SkeletonListing />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SkeletonListing />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SkeletonListing />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SkeletonListing />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SkeletonListing />
        </Grid>
      </Grid>
    </>
  );
}

export default function HistoryPage() {
  const axios = useAxios();
  const { status } = useSession({ required: true });

  const getHistory = async (): Promise<History[]> => {
    return axios.get("/history").then((res) => res.data);
  };

  const {
    data: historyItems,
    isError,
    isLoading,
  } = useQuery(["history"], getHistory);

  async function downloadListing(listing: Listing) {
    const res = await axios.get(`/history/${listing.id}`, {
      responseType: "blob",
    });
    const href = URL.createObjectURL(res.data);

    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", `${listing.name.replaceAll(" ", "_")}.caff`);

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
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
  if (isLoading) return <SkeletonListings />;
  if (isError) return "Error fetching history items. Please try again later";

  return (
    <>
      <Typography variant="h2" sx={{ py: 3 }}>
        History
      </Typography>
      <Grid container spacing={2}>
        {historyItems.map(({ listing }) => (
          <Grid key={listing.id} item xs={12} sm={6} md={4}>
            <ItemCard
              title={listing.name}
              caption={listing.caption}
              tags={listing.tags}
              preview={listing.media.preview}
              actionButton={
                <Button
                  size="small"
                  variant="contained"
                  sx={{ m: 1 }}
                  onClick={() => downloadListing(listing)}
                >
                  Download
                </Button>
              }
              disableHover
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
