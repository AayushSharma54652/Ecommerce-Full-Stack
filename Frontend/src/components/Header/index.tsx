import React, { useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { logout } from "../../store/reducers/authReducer";

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    dispatch(logout());
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Home", path: "/" },
    { text: "Shop", path: "/shop" },
    { text: "Cart", path: "/cart" },
    { 
      text: isAuthenticated ? "Profile" : "Sign In", 
      path: isAuthenticated ? "/profile" : "/signin" 
    },
    ...(isAuthenticated && user?.role === "ADMIN" 
      ? [{ text: "Add Product", path: "/add-product" }] 
      : [])
  ];

  const drawerContent = (
    <List>
      {menuItems.map((item) => (
        <ListItem 
          key={item.path} 
          component={Link} 
          to={item.path} 
          onClick={handleDrawerToggle}
        >
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
      {isAuthenticated && (
        <ListItem onClick={handleLogout}>
          <ListItemText primary="Logout" />
        </ListItem>
      )}
    </List>
  );

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My E-Commerce
          </Typography>
          
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <>
              {menuItems.map((item) => (
                <Button 
                  key={item.path} 
                  color="inherit" 
                  component={Link} 
                  to={item.path}
                >
                  {item.text}
                </Button>
              ))}
              {isAuthenticated && (
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240 
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Header;