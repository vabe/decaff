import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ItemCard from "@/components/item-card";
import useAxios from "@/hooks/use-axios";
import { Listing } from "../../mocks/types";

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
        <Skeleton variant="rounded" width={120} height={32} sx={{ m: 1 }} />
      </CardActions>
    </Card>
  );
}

function SkeletonListings() {
  return (
    <>
      <Typography variant="h3" sx={{ py: 2 }}>
        Available listings
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

export default function Listings() {
  const router = useRouter();
  const { data: session } = useSession();
  const axios = useAxios();

  const getListings = async (): Promise<Listing[]> => {
    return axios.get("/listings").then((res) => res.data);
  };

  const {
    data: listings,
    isError,
    isLoading,
  } = useQuery(["listings"], getListings);

  if (isLoading) return <SkeletonListings />;
  if (isError) return "Error fetching listings. Please try again later";

  return (
    <>
      <Typography variant="h2" sx={{ py: 3 }}>
        Available listings
      </Typography>
      <Grid container spacing={2}>
        {listings.map((listing) => (
          <Grid key={listing.id} item xs={12} sm={6} md={4}>
            <ItemCard
              preview={listing.media.preview}
              title={listing.name}
              caption={listing.caption}
              tags={listing.tags}
              disableAction={!session}
              onClick={() => router.push(`${router.pathname}/${listing.id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
