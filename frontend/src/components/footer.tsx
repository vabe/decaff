import Box from "@mui/material/Box";

export default function Footer() {
  return (
    <footer>
      <Box
        sx={{
          py: 4,
          borderTop: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Powered by deCAFF
      </Box>
    </footer>
  );
}
