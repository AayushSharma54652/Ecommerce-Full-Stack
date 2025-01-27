import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCreateOrderMutation } from '../../services/api';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();
  const [shippingAddress, setShippingAddress] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      setError('Shipping address is required');
      return;
    }

    try {
      const response = await createOrder({ shippingAddress }).unwrap();
      if (response.success) {
        navigate(`/order/${response.data._id}`);
      }
    } catch (err) {
      setError('Failed to create order. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Checkout</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Shipping Address"
              multiline
              rows={4}
              fullWidth
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              error={!!error}
              helperText={error}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Place Order
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CheckoutModal;