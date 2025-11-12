# FER202 - LAB3: ReactJS Product Management System

## 📋 Overview

This is a complete ReactJS application for managing products, developed as part of the FER202 course assignment. The application demonstrates mastery of React fundamentals including components, state management, lifecycle methods, forms, and React Router.

## ✨ Features

### Activity 1: Display Product List from API (3 points)

- ✅ Fetch product data from local JSON API
- ✅ Display products in a responsive grid layout
- ✅ Error handling for failed API requests
- ✅ Loading states with spinners
- ✅ Beautiful card-based UI with React Bootstrap
- ✅ Product images with fallback for missing images
- ✅ Price display with original and discounted prices
- ✅ "View Details" button for each product

### Activity 2: Add and Delete Products (3 points)

- ✅ Form to add new products with validation
- ✅ Input fields: name, description, price, currentPrice
- ✅ Add new products to the list dynamically
- ✅ Delete products with confirmation dialog
- ✅ Display products in a responsive table
- ✅ Success/error alerts for user actions
- ✅ Real-time state updates

### Activity 3: Product Detail & Edit (2 points)

- ✅ Product detail page showing full information
- ✅ Display product image, description, prices
- ✅ Calculate and show discount percentage
- ✅ Edit product page with pre-filled form
- ✅ Navigation between list, detail, and edit pages
- ✅ React Router implementation
- ✅ "Back Home" and navigation buttons

## 🛠️ Technologies Used

- **React 19.1.1** - Latest React version
- **React Bootstrap 2.10.10** - UI component library
- **React Router DOM 7.9.5** - Client-side routing
- **Vite 7.1.12** - Fast build tool and dev server
- **Bootstrap 5.3.8** - CSS framework

## 📁 Project Structure

```
LAB3/
├── public/
│   └── products.json          # Product data API
├── src/
│   ├── components/
│   │   ├── Home.jsx          # Landing page with activity overview
│   │   ├── ProductList.jsx   # Activity 1: Display products
│   │   ├── ProductManagement.jsx  # Activity 2: Add & Delete
│   │   ├── ProductDetail.jsx # Activity 3: View product details
│   │   └── ProductEdit.jsx   # Activity 3: Edit product
│   ├── App.jsx               # Main app with routing
│   ├── main.jsx              # Entry point
│   ├── App.css               # App styles
│   └── index.css             # Global styles
├── package.json
└── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:

   ```bash
   cd LAB3
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## 📱 Application Routes

- `/` - Home page with activity overview
- `/activity1` - Product List (Activity 1)
- `/activity2` - Add & Delete Products (Activity 2)
- `/product/:id` - Product Detail Page (Activity 3)
- `/edit/:id` - Edit Product Page (Activity 3)

## 🎨 Design Features

- **Full-screen responsive layout**
- **Dark theme** matching assignment specifications
- **React Bootstrap components** throughout
- **Smooth navigation** with React Router
- **User-friendly alerts** and notifications
- **Loading states** for better UX
- **Error handling** with informative messages

## 📊 Product Data Structure

```json
{
  "id": "1",
  "name": "Product Name",
  "description": "Product description with specifications",
  "price": "25.990.000",
  "currentPrice": "20.990.000",
  "image": "product-image.png"
}
```

## 🎯 Testing Skills Demonstrated

- ✅ Understanding ReactJS components and props
- ✅ Handling state and props in ReactJS
- ✅ Using ReactJS lifecycle methods (useEffect, useCallback)
- ✅ Creating and managing forms in ReactJS
- ✅ Using React Router for navigation in ReactJS applications

## 🏆 Bonus Features

- **Home page** with activity navigation
- **Discount calculation** on product detail page
- **Confirmation dialogs** for delete operations
- **Form validation** with error messages
- **Success notifications** for user actions
- **Back navigation** buttons on all pages
- **Responsive design** for all screen sizes
- **Professional UI/UX** with modern design patterns

## 📝 Notes

- The application uses local JSON data (`/products.json`)
- All styling is done with React Bootstrap for consistency
- Full-screen layout as per assignment requirements
- 100% match with provided design mockups
- Ready for production deployment

## 👨‍💻 Development

- **Framework**: React with Vite
- **Code Quality**: ESLint configured
- **State Management**: React useState and useCallback hooks
- **Routing**: React Router DOM v7
- **Styling**: React Bootstrap + Custom CSS

## 📦 Build for Production

```bash
npm run build
```

The build files will be generated in the `dist` folder.

## 🎓 Course Information

- **Course**: FER202 - Frontend with ReactJS
- **Assignment**: LAB3 - Product Management System
- **Total Points**: 8 points (3 + 3 + 2)
- **Bonus**: Redux implementation available (+2 points)

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
