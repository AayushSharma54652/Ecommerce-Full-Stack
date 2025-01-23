import React, { useState } from "react";
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
import { useAddToCartMutation } from "../../services/api";

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
  const [addToCart, { isLoading, isSuccess, error }] = useAddToCartMutation();
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(event.target.value));
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (quantity < 1) return;

    addToCart({ productId, quantity })
      .unwrap()
      .then(() => {
        setIsAdded(true);
      })
      .catch((err) => {
        console.error("Error adding item to cart:", err);
      });
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 2
        }
      }}
    >
      <CardActionArea 
        sx={{ 
          position: 'relative', 
          overflow: 'hidden' 
        }}
      >
        <CardMedia
          component="img"
          alt={title}
          image={image || '/placeholder-image.png'}
          sx={{ 
            width: '100%',
            height: 220,  // Fixed height
            objectFit: 'cover',  // Ensures image covers entire area
            objectPosition: 'center',  // Centers the image
            filter: 'brightness(0.95)' 
          }}
          onError={(e) => {
            const imgElement = e.target as HTMLImageElement;
            imgElement.src = '/placeholder-image.png';
          }}
        />
        <Chip 
          label={`$${price.toFixed(2)}`} 
          color="primary" 
          size="small"
          sx={{ 
            position: 'absolute', 
            top: 10, 
            right: 10,
            zIndex: 1 
          }} 
        />
      </CardActionArea>
      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
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
            WebkitBoxOrient: 'vertical',
            mb: 1
          }}
        >
          {description}
        </Typography>
      </CardContent>
      
      <Box 
        p={2} 
        pt={0}
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
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
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          disabled={isLoading || isAdded}
          size="small"
          sx={{ 
            ml: 1,
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
        >
          {isLoading ? "Adding..." : isAdded ? "Added" : "Add to Cart"}
        </Button>
      </Box>
    </Card>
  );
};

export default ProductCard;