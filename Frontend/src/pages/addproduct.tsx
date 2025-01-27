import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import { useCreateProductMutation } from "../services/api";
import { useNavigate } from "react-router-dom";

interface AddProductFormInputs {
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  images: string;
}

const AddProduct: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProductFormInputs>();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<AddProductFormInputs> = async (data) => {
    try {
      const productData = {
        ...data,
        images: [data.images],
        isActive: true,
      };
      await createProduct(productData).unwrap();
      navigate("/");
    } catch (err: any) {
      setError(err.data?.message || "Failed to add product");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          padding: 2,
        }}
      >
        <Paper
          elevation={10}
          component={motion.div}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          sx={{
            maxWidth: 600,
            width: "100%",
            padding: 4,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 3, textAlign: "center", fontWeight: "bold", color: "primary.main" }}
          >
            Add Product
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Product Name"
              {...register("name", { required: "Product name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ mb: 2 }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Description"
              {...register("description", { required: "Description is required" })}
              error={!!errors.description}
              helperText={errors.description?.message}
              sx={{ mb: 2 }}
              variant="outlined"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              {...register("price", { required: "Price is required" })}
              error={!!errors.price}
              helperText={errors.price?.message}
              sx={{ mb: 2 }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Category"
              {...register("category", { required: "Category is required" })}
              error={!!errors.category}
              helperText={errors.category?.message}
              sx={{ mb: 2 }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Stock Quantity"
              type="number"
              {...register("stockQuantity", { required: "Stock quantity is required" })}
              error={!!errors.stockQuantity}
              helperText={errors.stockQuantity?.message}
              sx={{ mb: 2 }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Image URL"
              {...register("images", { required: "Image URL is required" })}
              error={!!errors.images}
              helperText={errors.images?.message}
              sx={{ mb: 2 }}
              variant="outlined"
            />
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ mt: 2, py: 1.5, fontWeight: "bold" }}
              >
                {isLoading ? "Adding..." : "Add Product"}
              </Button>
            </motion.div>
          </form>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default AddProduct;
