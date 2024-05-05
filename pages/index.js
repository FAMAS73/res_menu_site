import React, { useEffect, useState } from "react";
import { db } from "@/utils/firebaseConfig"; // Adjust the import path as needed
import { collection, getDocs } from "firebase/firestore";
import {
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  Menu,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useRouter } from "next/router";

export default function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "menus"));
      const menusData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenus(menusData);
      setLoading(false);
    };

    fetchMenus();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAdminLogin = () => {
    router.push("/admin/login"); // Update this path to your actual admin login route
  };
  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <img
              src="https://img.wongnai.com/p/1968x0/2021/04/03/f9ec3761f14a477886283cd1ff2e757b.jpg"
              alt="Logo"
              style={{ height: 50, marginRight: 10 }}
            />
          </Box>
          {/* <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
          >
            Formula 1
          </Typography> */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Link href="/about">About</Link>
            </MenuItem>
          </Menu>
          <Button color="inherit" onClick={handleAdminLogin}>
            Admin Login
          </Button>
        </Toolbar>
      </AppBar>
      <Typography variant="h4" gutterBottom component="div" sx={{ mt: 2 }}>
        Restaurant Menus
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto",
        }}
      >
        {menus.map((menu) => (
          <Card
            key={menu.id}
            sx={{
              margin: "12px",
              width: "80%", // Adjusted for better fit in a column layout
              maxWidth: "600px", // Optional, to prevent the card from becoming too wide on larger screens
              minHeight: 300,
              borderRadius: 0,
              position: "relative",
              overflow: "hidden",
              bgcolor: "background.paper",
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image={menu.image_url}
              alt={menu.type}
              sx={{
                width: "100%",
                height: 140,
                objectFit: "cover",
              }}
            />
            <CardContent
              sx={{
                position: "relative",
                zIndex: 2,
                textAlign: "center",
                bgcolor: "rgba(0,0,0,0.7)",
                color: "#fff",
              }}
            >
              <Typography variant="h5" component="div">
                {menu.type}
              </Typography>
              <Typography variant="body2">{menu.info}</Typography>
              {/* <Typography variant="body2">Base: {menu.base}</Typography> */}
              <Button variant="contained" sx={{ mt: 2 }}>
                <Link href={`/menus/${menu.id}`}>ดู{menu.type}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}