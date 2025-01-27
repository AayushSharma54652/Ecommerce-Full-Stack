# E-commerce Web Application

A full-stack e-commerce platform built with React, TypeScript, Node.js, and MongoDB. This application features user authentication, product management, shopping cart functionality, and order processing.

## 🚀 Features

### User Features
- User authentication (Sign up, Sign in)
- User profile management
- Shopping cart functionality
- Order placement and management
- Secure checkout process

### Product Features
- Product browsing and search
- Product categories
- Product details view
- Add products to cart
- Quantity management in cart

### Admin Features
- Product management (Add, Edit, Delete)
- Order management
- User management

## 🛠️ Technology Stack

### Frontend
- React (with TypeScript)
- Redux Toolkit (RTK Query for API calls)
- Material-UI (MUI) for UI components
- Framer Motion for animations
- React Router for navigation
- TypeScript for type safety

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- TypeScript


## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [your-repository-url]
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

4. Environment Setup

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start the Backend Server
```bash
cd backend
npm run dev
```

2. Start the Frontend Development Server
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## 📝 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add-to-cart` - Add item to cart
- `PUT /api/cart/update-quantity` - Update item quantity
- `DELETE /api/cart/remove-item` - Remove item from cart

### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Access tokens for API authentication
- Refresh tokens for obtaining new access tokens
- Protected routes require valid JWT in Authorization header

## 🎨 UI Components

The application uses Material-UI components with custom styling:
- Responsive design
- Custom theme configuration
- Animated components using Framer Motion
- Form validation and error handling

## ⚡ State Management

Redux Toolkit is used for state management:
- RTK Query for API calls and caching
- Authentication state management
- Cart state management
- Loading and error states

## 🛡️ Security Features

- JWT authentication
- Password hashing
- Protected routes
- Input validation
- Error handling
- CORS configuration

## 🔄 Error Handling

The application includes comprehensive error handling:
- API error responses
- Frontend error boundaries
- Form validation errors
- Network error handling
- Loading states for API calls

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Configure MongoDB connection
3. Deploy to your preferred hosting service (e.g., Heroku, DigitalOcean)

### Frontend Deployment
1. Build the production bundle
```bash
npm run build
```
2. Deploy the build folder to static hosting (e.g., Netlify, Vercel)

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details

## 👥 Authors

[Aayush Sharma] - Initial work

## 🙏 Acknowledgments

- Material-UI for the component library
- MongoDB for the database
- React and TypeScript communities