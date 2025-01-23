import React from "react";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Container, 
  Grid 
} from "@mui/material";
import ProductCard from "../components/ProductCard";
import { useGetProductsQuery } from "../services/api";

const Home: React.FC = () => {
  const { data, error, isLoading } = useGetProductsQuery();

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
      >
        <Typography color="error" variant="h6">
          Failed to load products. Please try again later.
        </Typography>
      </Box>
    );
  }

  const products = data?.data.products || [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom>
          Welcome to My E-Commerce
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover amazing products and deals!
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <ProductCard
              productId={product._id}
              title={product.name}
              price={product.price}
              description={product.description}
              image={product.images[0]}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;