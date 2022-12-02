import * as React from "react";
import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type ItemCardProps = {
  title: string;
  caption?: string;
  tags?: string[];
  disableAction?: boolean;
  actionButton?: any;
  onClick?: () => void;
  disableHover?: boolean;
};

function ItemCardCaption({ caption }: { caption: string | undefined }) {
  if (isUndefined(caption)) return <></>;

  return (
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
  );
}

function ItemCardTags({ tags }: { tags: string[] | undefined }) {
  if (isUndefined(tags) || isEmpty(tags)) return <></>;

  return (
    <Box>
      {tags.map((tag) => (
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
  );
}

export default function ItemCard({
  title,
  caption,
  tags,
  disableAction,
  actionButton,
  onClick,
  disableHover,
}: ItemCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{ ...(!disableHover && { "&:hover": { cursor: "pointer" } }) }}
    >
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
          <ItemCardCaption caption={caption} />
          <ItemCardTags tags={tags} />
        </Stack>
      </CardContent>
      {!disableAction && <CardActions>{actionButton}</CardActions>}
    </Card>
  );
}
