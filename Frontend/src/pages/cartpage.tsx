import React from "react";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Button, 
  Divider, 
  Paper, 
  Grid, 
  IconButton 
} from "@mui/material";
import { 
  RemoveShoppingCart as EmptyCartIcon, 
  Add as AddIcon, 
  Remove as RemoveIcon,
  Delete as DeleteIcon 
} from "@mui/icons-material";
import { useGetCartQuery } from "../services/api";
import { useAppSelector } from "../store/store";

const CartPage: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { data, error, isLoading } = useGetCartQuery();

  if (!isAuthenticated) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <Paper 
          elevation={10} 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            maxWidth: 400, 
            borderRadius: 3 
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
          minHeight: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <Paper 
          elevation={10} 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            maxWidth: 400, 
            borderRadius: 3 
          }}
        >
          <Typography color="error" variant="h6">
            Failed to load cart. Please try again later.
          </Typography>
        </Paper>
      </Box>
    );
  }

  const cart = data?.data;
  const items = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        py: 4,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto', px: 2 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 3, 
            textAlign: 'center', 
            fontWeight: 'bold', 
            color: 'primary.main' 
          }}
        >
          Your Cart
        </Typography>

        {items.length > 0 ? (
          <Paper elevation={5} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            {items.map((item) => (
              <Box key={item.productId._id}>
                <Grid 
                  container 
                  spacing={2} 
                  sx={{ 
                    p: 2, 
                    alignItems: 'center',
                    '&:hover': { 
                      backgroundColor: 'action.hover' 
                    } 
                  }}
                >
                  <Grid item xs={12} sm={3}>
                    <img
                      src={item.productId.images[0]}
                      alt={item.productName}
                      style={{ 
                        width: '100%', 
                        height: 120, 
                        objectFit: 'cover', 
                        borderRadius: 8 
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
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
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
            ))}
            
            <Box 
              sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
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
              textAlign: 'center', 
              py: 4, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}
          >
            <EmptyCartIcon sx={{ fontSize: 100, color: 'text.secondary' }} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Your cart is empty
            </Typography>
          </Box>
        )}

        {items.length > 0 && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ 
                px: 6, 
                py: 1.5, 
                borderRadius: 3,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              Proceed to Checkout
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CartPage;