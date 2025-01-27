import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Divider,
  Paper,
  Grid,
  IconButton,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  RemoveShoppingCart as EmptyCartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useGetCartQuery, useCreateOrderMutation } from "../services/api";
import { useAppSelector } from "../store/store";

const CartPage: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data, error, isLoading } = useGetCartQuery();
  const [createOrder] = useCreateOrderMutation();
  const navigate = useNavigate();

  // New state for address dialog
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const skeletonArray = new Array(3).fill(0);
  const cart = data?.data;
  const items = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;

  // Handle checkout process
  const handleCheckout = async () => {
    setOpenAddressDialog(true);
  };

  // Handle address submission and order creation
  const handleAddressSubmit = async () => {
    if (!shippingAddress.trim()) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await createOrder({ shippingAddress }).unwrap();
      if (response.success) {
        navigate("/order", { state: { orderData: response.data } });
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      // You can add error handling UI here if needed
    } finally {
      setIsProcessing(false);
      setOpenAddressDialog(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 4,
            textAlign: "center",
            maxWidth: 400,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" color="error">
            You need to log in to view the cart.
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          gap: 2,
        }}
      >
        {skeletonArray.map((_, index) => (
          <Paper key={index} sx={{ p: 2, width: "90%", maxWidth: 800 }}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={120}
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={20} />
              </Grid>
              <Grid item xs={3} display="flex" alignItems="center">
                <Skeleton variant="rectangular" width="100%" height={50} />
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 4,
            textAlign: "center",
            maxWidth: 400,
            borderRadius: 3,
          }}
        >
          <Typography color="error" variant="h6">
            Failed to load cart. Please try again later.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Box sx={{ maxWidth: 800, mx: "auto", px: 2 }}>
        <Typography
          variant="h4"
          component={motion.h4}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            mb: 3,
            textAlign: "center",
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          Your Cart
        </Typography>

        {items.length > 0 ? (
          <Paper elevation={5} sx={{ borderRadius: 3, overflow: "hidden" }}>
            {items.map((item, index) => (
              <motion.div
                key={item.productId._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: index * 0.1 },
                }}
                whileHover={{ scale: 1.02 }}
              >
                <Box>
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      p: 2,
                      alignItems: "center",
                      "&:hover": { backgroundColor: "action.hover" },
                    }}
                  >
                    <Grid item xs={12} sm={3}>
                      <img
                        src={item.productId.images[0]}
                        alt={item.productName}
                        style={{
                          width: "100%",
                          height: 120,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <Typography variant="h6">{item.productName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${item.productPrice.toFixed(2)} each
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <IconButton size="small" color="primary">
                        <RemoveIcon />
                      </IconButton>
                      <Typography variant="body1">{item.quantity}</Typography>
                      <IconButton size="small" color="primary">
                        <AddIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Divider />
                </Box>
              </motion.div>
            ))}

            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Total</Typography>
              <Typography variant="h5" color="primary.main">
                ${totalPrice.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <EmptyCartIcon sx={{ fontSize: 100, color: "text.secondary" }} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Your cart is empty
            </Typography>
          </Box>
        )}

        {items.length > 0 && (
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 3,
                }}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </motion.div>
          </Box>
        )}

        {/* Address Dialog */}
        <Dialog
          open={openAddressDialog}
          onClose={() => setOpenAddressDialog(false)}
        >
          <DialogTitle>Enter Shipping Address</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Shipping Address"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddressDialog(false)}>Cancel</Button>
            <Button
              onClick={handleAddressSubmit}
              disabled={!shippingAddress.trim() || isProcessing}
            >
              {isProcessing ? (
                <CircularProgress size={24} />
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CartPage;