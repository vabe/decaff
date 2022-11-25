import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type ItemCardProps = {
  title: string;
  href?: string;
  caption?: string;
  tags?: string[];
  disableAction?: boolean;
  handleButtonClick?: () => void;
};

export default function ItemCard({
  title,
  caption,
  tags,
  href,
  disableAction,
  handleButtonClick,
}: ItemCardProps) {
  return (
    <Card>
      <CardContent sx={{ pb: 0 }}>
        <Stack spacing={1}>
          <Box
            sx={{
              bgcolor: "primary.main",
              borderRadius: 3,
              height: 175,
              mb: 2,
            }}
          ></Box>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: "3",
              WebkitBoxOrient: "vertical",
            }}
          >
            {caption}
          </Typography>
          <Box>
            {tags?.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                variant="outlined"
                size="small"
                sx={{ mb: 1, mr: 1 }}
              />
            ))}
          </Box>
        </Stack>
      </CardContent>
      {!disableAction && (
        <CardActions>
          <Button
            size="small"
            onClick={() => (handleButtonClick ? handleButtonClick() : null)}
          >
            Buy
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
