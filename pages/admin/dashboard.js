import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAuth, signOut } from "firebase/auth";
import { db } from "@/utils/firebaseConfig"; // Adjust this path as needed
import {
  collection,
  doc,
  getDocs,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ListItemText,
} from "@mui/material";

const AdminDashboard = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuDialog, setOpenMenuDialog] = useState(false);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [currentMenu, setCurrentMenu] = useState({
    type: "",
    info: "",
    image_url: "",
  });
  const [currentItem, setCurrentItem] = useState({
    name: "",
    info: "",
    image_url: "",
    menu_id: "",
    price:"",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "menus"));
    const menusData = [];
    for (const doc of querySnapshot.docs) {
      const menuData = {
        id: doc.id,
        ...doc.data(),
        items: [],
      };
      const itemsSnapshot = await getDocs(
        collection(db, "menus", doc.id, "items")
      );
      menuData.items = itemsSnapshot.docs.map((itemDoc) => ({
        id: itemDoc.id,
        ...itemDoc.data(),
      }));
      menusData.push(menuData);
    }
    setMenus(menusData);
    setLoading(false);
  };

  const handleOpenMenuDialog = (menu = null) => {
    setCurrentMenu(
      menu || { type: "", info: "", image_url: "" }
    );
    setOpenMenuDialog(true);
    setIsEditMode(!!menu);
  };

  const handleOpenItemDialog = (item = null, menuId = "") => {
    setCurrentItem(
      item || { name: "", info: "", image_url: "", menu_id: menuId }
    );
    setOpenItemDialog(true);
    setIsEditMode(!!item);
  };

  const handleCloseDialog = () => {
    setOpenMenuDialog(false);
    setOpenItemDialog(false);
    setIsEditMode(false);
  };

  const handleSubmitMenu = async () => {
    const menuRef = isEditMode
      ? doc(db, "menus", currentMenu.id)
      : collection(db, "menus");
    isEditMode
      ? await updateDoc(menuRef, currentMenu)
      : await addDoc(menuRef, currentMenu);
    fetchMenus();
    handleCloseDialog();
  };

  const handleSubmitItem = async () => {
    const itemRef = isEditMode
      ? doc(db, "menus", currentItem.menu_id, "items", currentItem.id)
      : collection(db, "menus", currentItem.menu_id, "items");
    isEditMode
      ? await updateDoc(itemRef, currentItem)
      : await addDoc(itemRef, currentItem);
    fetchMenus();
    handleCloseDialog();
    };
 //   if (condition) {..} else { }
//      condition ? value_if_true : value_if_false

  const handleDelete = async (type, id, menuId = null) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      const ref =
        type === "menu"
          ? doc(db, "menus", id)
          : doc(db, "menus", menuId, "items", id);
      await deleteDoc(ref);
      fetchMenus();
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard - Menus and Items
      </Typography>
      <Button variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
      <Button variant="outlined" onClick={() => handleOpenMenuDialog()}>
        Add New Menu
      </Button>
      <Button variant="outlined" onClick={() => handleOpenItemDialog(null, "")}>
        Add New Item
      </Button>
      {menus.map((menu) => (
        <Card key={menu.id} sx={{ mb: 2 }}>
          <CardMedia
            component="img"
            height="140"
            image={menu.image_url}
            alt={menu.type}
          />
          <CardContent>
            <Typography variant="h5">{menu.type}</Typography>
            <Typography>{menu.info}</Typography>
            <Button onClick={() => handleOpenMenuDialog(menu)}>
              Edit Menu
            </Button>
            <Button onClick={() => handleDelete("Menu", menu.id)}>
              Delete Menu
            </Button>
            <Typography variant="subtitle1">Items:</Typography>
            {menu.items.map((item) => (
              <ListItem key={item.id}>
                <ListItemAvatar>
                  <Avatar src={item.image_url} alt={item.name} />
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary={item.info} />
                <Button onClick={() => handleOpenItemDialog(item, menu.id)}>
                  Edit Item
                </Button>
                <Button onClick={() => handleDelete("item", item.id, menu.id)}>
                  Delete Item
                </Button>
              </ListItem>
            ))}
            <Button onClick={() => handleOpenItemDialog(null, menu.id)}>
              Add Item to This Menu
            </Button>
          </CardContent>
        </Card>
      ))}
      <Dialog open={openMenuDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditMode ? "Edit Menu" : "Add New Menu"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={currentMenu.type}
            onChange={(e) =>
              setCurrentMenu({ ...currentMenu, type: e.target.value })
            }
          />
          <TextField
            label="Info"
            fullWidth
            margin="dense"
            value={currentMenu.info}
            onChange={(e) =>
              setCurrentMenu({ ...currentMenu, info: e.target.value })
            }
          />
          {/* <TextField
            label="Price"
            fullWidth
            margin="dense"
            value={currentMenu.team_principal}
            onChange={(e) =>
              setCurrentMenu({ ...currentMenu, team_principal: e.target.value })
            }
          /> */}
          <TextField
            label="Image URL"
            fullWidth
            margin="dense"
            value={currentMenu.image_url}
            onChange={(e) =>
              setCurrentMenu({ ...currentMenu, image_url: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitMenu}>Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openItemDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditMode ? "Edit Item" : "Add New Item"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={currentItem.name}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, name: e.target.value })
            }
          />
          <TextField
            label="Info"
            fullWidth
            margin="dense"
            value={currentItem.info}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, info: e.target.value })
            }
          />
          <TextField
            label="Price"
            fullWidth
            margin="dense"
            value={currentItem.price}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, info: e.target.value })
            }
          />
          <TextField
            label="Image URL"
            fullWidth
            margin="dense"
            value={currentItem.image_url}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, image_url: e.target.value })
            }
          />
          <FormControl fullWidth>
            <InputLabel id="menu-select-label">Menu</InputLabel>
            <Select
              labelId="menu-select-label"
              id="menu-select"
              value={currentItem.menu_id}
              label="Menu"
              onChange={(e) =>
                setCurrentItem({ ...currentItem, menu_id: e.target.value })
              }
            >
              {menus.map((menu) => (
                <MenuItem key={menu.id} value={menu.id}>
                  {menu.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitItem}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
