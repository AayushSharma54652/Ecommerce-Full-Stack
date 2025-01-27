import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useLocation, Navigate } from "react-router-dom";

interface OrderItem {
  productId: {
    _id: string;
    name: string;
    images: string[];
  };
  quantity: number;
  price: number;
}
import { motion } from "framer-motion";

const OrderPage: React.FC = () => {
  const location = useLocation();
  const orderData = location.state?.orderData;

  if (!orderData) {
    return <Navigate to="/cart" replace />;
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
          Order Summary
        </Typography>

        <Paper elevation={5} sx={{ borderRadius: 3, overflow: "hidden", mb: 3 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Status: {orderData.status}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Shipping Address: {orderData.shippingAddress}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Order ID: {orderData._id}
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            {orderData.items.map((item: OrderItem, index: number) => (
              <motion.div
                key={item.productId._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={3}>
                    <img
                      src={item.productId.images[0]}
                      alt={item.productId.name}
                      style={{
                        width: "100%",
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">{item.productId.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price per item: ${item.price.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6" align="right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
                {index < orderData.items.length - 1 && <Divider sx={{ my: 2 }} />}
              </motion.div>
            ))}
          </Box>

          <Divider />

          <Box sx={{ p: 3 }}>
            <Typography variant="h5" align="right">
              Total Amount: ${orderData.totalAmount.toFixed(2)}
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ textAlign: "center" }}>
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
              onClick={() => {
                // Payment logic will be implemented later
                console.log("Process payment for order:", orderData._id);
              }}
            >
              Pay Now
            </Button>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderPage;