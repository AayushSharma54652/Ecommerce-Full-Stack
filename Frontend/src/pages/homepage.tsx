import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Skeleton,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductCard from "../components/ProductCard";
import { useGetProductsQuery } from "../services/api";

const Home: React.FC = () => {
  const { data, error, isLoading } = useGetProductsQuery();
  const [showProducts, setShowProducts] = useState(false);

  const skeletonArray = new Array(8).fill(0); // Skeleton placeholders for 8 items

  // Simulate a delay of 2–3 seconds before rendering products
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowProducts(true), 2000); // 2-second delay
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (error) {
    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
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

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Page Header */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -50 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: "easeOut" },
        }}
        textAlign="center"
        mb={6}
      >
        <Typography
          variant="h3"
          component={motion.h3}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Explore Our Collection
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          component={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          sx={{ maxWidth: "600px", margin: "0 auto" }}
        >
          Find exclusive deals and the latest products tailored just for you.
        </Typography>
      </Box>

      {/* Product Grid */}
      <AnimatePresence>
        <Grid container spacing={4}>
          {isLoading || !showProducts
            ? skeletonArray.map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      height={180}
                      sx={{
                        backgroundColor: "#e0f7fa",
                        marginBottom: 1,
                      }}
                    />
                    <CardContent>
                      <Skeleton
                        variant="text"
                        animation="wave"
                        height={30}
                        width="80%"
                        sx={{ backgroundColor: "#b2ebf2" }}
                      />
                      <Skeleton
                        variant="text"
                        animation="wave"
                        height={20}
                        width="60%"
                        sx={{ backgroundColor: "#80deea" }}
                      />
                      <Skeleton
                        variant="text"
                        animation="wave"
                        height={20}
                        width="40%"
                        sx={{ backgroundColor: "#4dd0e1" }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : data?.data.products.map((product, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={product._id}
                  component={motion.div}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: "easeOut",
                    },
                  }}
                  exit={{ opacity: 0, y: -50 }}
                  whileHover={{ y: -10 }}
                >
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
      </AnimatePresence>
    </Container>
  );
};

export default Home;
