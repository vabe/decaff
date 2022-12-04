import * as React from "react";
import { useRouter } from "next/router";
import {
  ArrowRightOnRectangleIcon,
  ArrowUpTrayIcon,
  Bars3Icon,
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  PhotoIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import { ListItemText } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  const pages = [
    {
      label: "Listings",
      href: "/listings",
      icon: <PhotoIcon style={{ height: 20 }} />,
    },
    {
      label: "Users",
      href: "/users",
      icon: <UsersIcon style={{ height: 20 }} />,
    },
    {
      label: "Upload",
      href: "/upload",
      icon: <ArrowUpTrayIcon style={{ height: 20 }} />,
    },
  ];

  const settings = [
    {
      label: "Account",
      href: "/account",
      icon: <UserCircleIcon style={{ height: 20 }} />,
      action: () => router.push("/account"),
    },
    {
      label: "History",
      href: "/history",
      icon: <ClipboardDocumentListIcon style={{ height: 20 }} />,
      action: () => router.push("/history"),
    },
    {
      label: "Logout",
      href: "/sign-out",
      icon: <ArrowRightOnRectangleIcon style={{ height: 20 }} />,
      action: () => signOut(),
    },
  ];

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCollapsedNavMenuClick = (href: string) => {
    router.push(href);
    handleCloseNavMenu();
  };

  const handleUserMenuClick = (action: () => {} | undefined) => {
    action?.();
    handleCloseUserMenu();
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (href: string) => {
    router.push(href);
  };

  const getUserProfileImage = React.useMemo(() => {
    return session?.user?.image ?? "";
  }, [session?.user]);

  return (
    <AppBar
      position="fixed"
      sx={{
        color: "primary.main",
        backdropFilter: "blur(5px)",
        bgcolor: "hsla(0,0%,100%,.8)",
        boxShadow: "none",
        border: "none",
      }}
      elevation={0}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <BuildingStorefrontIcon style={{ height: 24 }} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mx: 2,
              display: { xs: "none", md: "flex" },
              color: "inherit",
              cursor: "pointer",
            }}
            onClick={() => handleMenuItemClick("/")}
          >
            deCAFF
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <Bars3Icon style={{ height: 24 }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.href}
                  onClick={() => handleCollapsedNavMenuClick(page.href)}
                >
                  <ListItemIcon sx={{ color: "primary.main" }}>
                    {page.icon}
                  </ListItemIcon>
                  <ListItemText>{page.label}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <BuildingStorefrontIcon style={{ height: 24 }} />
          </Box>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mx: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
            onClick={() => handleMenuItemClick("/")}
          >
            deCAFF
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.href}
                onClick={() => handleMenuItemClick(page.href)}
                sx={{ my: 0, display: "block", textTransform: "none" }}
              >
                {page.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <Chip
                color="primary"
                avatar={<Avatar alt="Remy Sharp" src={getUserProfileImage} />}
                label="Profile"
                variant="outlined"
                onClick={handleOpenUserMenu}
              ></Chip>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.href}
                  onClick={() => handleUserMenuClick(setting.action)}
                >
                  <ListItemIcon sx={{ color: "primary.main" }}>
                    {setting.icon}
                  </ListItemIcon>
                  <ListItemText>{setting.label}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
