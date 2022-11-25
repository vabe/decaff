import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ItemCard from "@/components/item-card";

export default function Home() {
  return (
    <Box>
      <Typography variant="h3" sx={{ pt: 3, fontWeight: 700 }}>
        Welcome to deCAFF
      </Typography>

      <Typography variant="h6" sx={{ pt: 3, fontWeight: 700, pb: 2 }}>
        Latest images
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <ItemCard title="Something" disableAction />
        </Grid>
        <Grid item xs={6} md={4}>
          <ItemCard title="Something" disableAction />
        </Grid>
        <Grid item xs={6} md={4}>
          <ItemCard title="Something" disableAction />
        </Grid>
        <Grid item xs={6} md={4}>
          <ItemCard title="Something" disableAction />
        </Grid>
        <Grid item xs={6} md={4}>
          <ItemCard title="Something" disableAction />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ pt: 3, fontWeight: 700 }}>
        About CIFF
      </Typography>
      <Typography>
        Nulla do cupidatat elit commodo ipsum tempor sit dolore. Fugiat commodo
        exercitation voluptate esse aute ut sint. Duis ut fugiat dolor sunt.
        Anim aliqua consequat ad laborum exercitation duis do commodo enim
        dolore nostrud cillum. Sint anim id magna voluptate velit adipisicing
        laborum ad laboris ullamco et consequat cupidatat. Reprehenderit non
        sunt eu proident incididunt pariatur labore commodo cillum veniam
        laborum mollit. Reprehenderit amet eiusmod sunt magna voluptate ipsum
        aute ipsum minim Lorem pariatur. Consectetur dolor ut cupidatat veniam
        fugiat officia duis velit anim mollit.
      </Typography>

      <Typography variant="h6" sx={{ pt: 3, fontWeight: 700 }}>
        About CAFF
      </Typography>
      <Typography>
        Nulla do cupidatat elit commodo ipsum tempor sit dolore. Fugiat commodo
        exercitation voluptate esse aute ut sint. Duis ut fugiat dolor sunt.
        Anim aliqua consequat ad laborum exercitation duis do commodo enim
        dolore nostrud cillum. Sint anim id magna voluptate velit adipisicing
        laborum ad laboris ullamco et consequat cupidatat. Reprehenderit non
        sunt eu proident incididunt pariatur labore commodo cillum veniam
        laborum mollit. Reprehenderit amet eiusmod sunt magna voluptate ipsum
        aute ipsum minim Lorem pariatur. Consectetur dolor ut cupidatat veniam
        fugiat officia duis velit anim mollit.
      </Typography>
    </Box>
  );
}
