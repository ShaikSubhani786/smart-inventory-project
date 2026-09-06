import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProtectedRoute from "./components/ProtectedRoute";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import Stock from "./pages/Stock";
import Sales from "./pages/Sales";
import Purchases from "./pages/Purchases";
import Reports from "./pages/Reports";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
  path="/register"
  element={<Register />}
/>
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
  path="/suppliers"
  element={
    <ProtectedRoute>
      <Suppliers />
    </ProtectedRoute>
  }
/>
<Route
  path="/stock"
  element={
    <ProtectedRoute>
      <Stock />
    </ProtectedRoute>
  }
/>
<Route
  path="/sales"
  element={
    <ProtectedRoute>
      <Sales />
    </ProtectedRoute>
  }
/>
<Route
  path="/purchases"
  element={
    <ProtectedRoute>
      <Purchases />
    </ProtectedRoute>
  }
/>
<Route
  path="/reports"
  element={
    <ProtectedRoute>
      <Reports />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;