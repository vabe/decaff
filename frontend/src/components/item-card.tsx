import * as React from "react";
import { useMemo } from "react";
import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import createPreviewFromBuffer from "@/utils/create-image-buffer";

type ItemCardProps = {
  actionButton?: any;
  caption?: string;
  disableAction?: boolean;
  disableHover?: boolean;
  preview: number[];
  tags?: string[];
  title: string;
  onClick?: () => void;
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
  actionButton,
  caption,
  disableAction,
  disableHover,
  preview,
  tags,
  title,
  onClick,
}: ItemCardProps) {
  const previewBuffer = useMemo(
    () => createPreviewFromBuffer(preview),
    [preview]
  );

  return (
    <Card
      onClick={onClick}
      sx={{ ...(!disableHover && { "&:hover": { cursor: "pointer" } }) }}
    >
      <CardContent sx={{ pb: 0 }}>
        <Stack spacing={1}>
          <Box
            sx={{
              borderRadius: 3,
              mb: 2,
              display: "flex",
              overflow: "hidden",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewBuffer} alt={caption} />
          </Box>
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
