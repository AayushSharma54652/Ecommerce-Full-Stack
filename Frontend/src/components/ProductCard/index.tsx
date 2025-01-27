import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  TextField, 
  CardActionArea,
  Chip
} from "@mui/material";
import { toast } from 'react-toastify';
import { useAddToCartMutation } from "../../services/api";
import { useAppSelector } from "../../store/store";

interface ProductCardProps {
  title: string;
  price: number;
  image?: string;
  description?: string;
  productId: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  image,
  description,
  productId,
}) => {
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(event.target.value));
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart');
      return;
    }

    if (quantity < 1) return;

    addToCart({ productId, quantity })
      .unwrap()
      .then(() => {
        setIsAdded(true);
        toast.success('Added to cart successfully!');
      })
      .catch((err) => {
        console.error("Error adding item to cart:", err);
        toast.error('Failed to add item to cart. Please try again.');
      });
  };

  return (
    <Card 
      component={motion.div}
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.97 }}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Box 
        component={motion.div}
        whileHover={{ opacity: 1 }}
        sx={{ 
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '75%' // 4:3 aspect ratio
        }}
      >
        <CardMedia
          component="img"
          alt={title}
          image={image || '/placeholder-image.png'}
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)'
            }
          }}
          onError={(e) => {
            const imgElement = e.target as HTMLImageElement;
            imgElement.src = '/placeholder-image.png';
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Chip 
            label={`$${price.toFixed(2)}`} 
            color="primary" 
            size="small"
            sx={{ 
              position: 'absolute', 
              top: 10, 
              right: 10,
              zIndex: 1,
              fontWeight: 'bold',
              backgroundColor: 'rgba(25, 118, 210, 0.9)'
            }} 
          />
        </motion.div>
      </Box>

      <CardContent 
        component={motion.div}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          gap: 1
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontWeight: 600
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            flexGrow: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {description}
        </Typography>

        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 2
          }}
        >
          <TextField
            label="Qty"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{ min: 1 }}
            size="small"
            sx={{ width: '80px' }}
          />
          <Button
            component={motion.button}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            variant="contained"
            color="primary"
            onClick={handleAddToCart}
            disabled={isLoading || isAdded}
            size="small"
            sx={{ 
              ml: 1,
              px: 2,
              fontWeight: 'bold',
              backgroundImage: 'linear-gradient(to right, #1976d2, #1565c0)',
              '&:hover': {
                backgroundImage: 'linear-gradient(to right, #1565c0, #0d47a1)'
              }
            }}
          >
            {isLoading ? "Adding..." : isAdded ? "Added ✓" : "Add to Cart"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;