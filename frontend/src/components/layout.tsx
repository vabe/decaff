import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Navbar from "@/components/navbar";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <Toolbar />
      <Box
        sx={{
          mt: 0,
          mx: 3,
          mb: 2.5,
          p: 2,
          borderRadius: 2,
          bgcolor: "secondary.main",
          minHeight: "calc(100% - 64px - 16px)",
        }}
      >
        <Container maxWidth="xl">{children}</Container>
      </Box>
      <Box sx={{ height: 2 }}></Box>
    </>
  );
}
