import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "@/utils/firebaseConfig"; // Adjust the import path as needed
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import {
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

export default function MenuDetails() {
  const [menu, setMenu] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { menuId } = router.query;

  useEffect(() => {
    const fetchMenuAndItems = async () => {
      if (menuId) {
        setLoading(true);
        const menuRef = doc(db, "menus", menuId);
        const menuDoc = await getDoc(menuRef);
        if (menuDoc.exists()) {
          setMenu(menuDoc.data());
          const itemsCollection = collection(db, "menus", menuId, "items");
          const itemDocs = await getDocs(itemsCollection);
          setItems(
            itemDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        }
        setLoading(false);
      }
    };

    fetchMenuAndItems();
  }, [menuId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => router.push("/")}
          >
            <ArrowBackIcon />
          </IconButton>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      {/* if(menu){menu.type} else {"Item Details"};
                  condition ? value_if_true : value_if_false */}
            {menu ? menu.type : "Item Details"}
          </Typography>        
        </Toolbar>
      </AppBar>
      <Typography variant="h4" gutterBottom component="div" sx={{ mt: 2 }}>
        เมนู{menu ? menu.type : ""}
      </Typography>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {items.map((item) => (
          <Card
            key={item.id}
            sx={{
              margin: "12px",
              minWidth: 300,
              maxWidth: 300,
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
              image={item.image_url}
              alt={item.name}
              sx={{
                width: "100%",
                height: 140,
                objectFit: "contain", // Adjusted to 'contain' to fit the image properly within the bounds
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
                {item.name}
              </Typography>
              <Typography variant="body2">{item.info}</Typography>
              <Typography variant="body3">Price: {item.price}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
