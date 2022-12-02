import { useMemo } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Comment as CommentProp } from "@/../mocks/types";

export default function Comment({
  userId,
  content,
  createdAt,
  user,
}: CommentProp) {
  const createdAtString = useMemo(() => {
    return new Date(createdAt).toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [createdAt]);

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        py: 3,
        px: 4,
        my: 1,
        bgcolor: "white",
        border: "1px solid rgb(229, 231, 235)",
        borderRadius: 3,
        boxShadow: "0 2px 5px -4px rgba(0,0,0,0.34)",
      }}
    >
      <Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pb: 2 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={userId} />
            <Typography variant="body1" fontWeight={700}>
              {user?.name ?? "N/A"}
            </Typography>
          </Stack>
          <Typography
            variant="subtitle2"
            fontWeight={400}
            sx={{ color: "grey.500" }}
          >
            {createdAtString}
          </Typography>
        </Stack>

        <Typography variant="body1">{content}</Typography>
      </Box>
    </Stack>
  );
}
