import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
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
  const { register, handleSubmit, formState: { errors } } = useForm<AddProductFormInputs>();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<AddProductFormInputs> = async (data) => {
    try {
      const productData = {
        ...data,
        images: [data.images], // Wrap the image URL in an array
        isActive: true,
      };
      await createProduct(productData).unwrap();
      navigate("/");
    } catch (err: any) {
      setError(err.data?.message || "Failed to add product");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 5, p: 3, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>Add Product</Typography>
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? "Adding..." : "Add Product"}
        </Button>
      </form>
    </Box>
  );
};

export default AddProduct;
