import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { PublicLayout } from "./layouts/PublicLayout";
import { Admin } from "./pages/Admin";
import { BusinessDetails } from "./pages/BusinessDetails";
import { Businesses } from "./pages/Businesses";
import { DashboardOverview } from "./pages/DashboardOverview";
import { DashboardProducts } from "./pages/DashboardProducts";
import { DashboardProfile } from "./pages/DashboardProfile";
import { DashboardRequests } from "./pages/DashboardRequests";
import { Favorites } from "./pages/Favorites";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { MyRequests } from "./pages/MyRequests";
import { ProductDetails } from "./pages/ProductDetails";
import { Products } from "./pages/Products";
import { Register } from "./pages/Register";

export const App = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<Home />} />
      <Route path="businesses" element={<Businesses />} />
      <Route path="businesses/:id" element={<BusinessDetails />} />
      <Route path="products" element={<Products />} />
      <Route path="products/:id" element={<ProductDetails />} />
      <Route path="favorites" element={<Favorites />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route
        path="my-requests"
        element={
          <ProtectedRoute roles={["customer"]}>
            <MyRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Admin />
          </ProtectedRoute>
        }
      />
    </Route>

    <Route
      path="dashboard"
      element={
        <ProtectedRoute roles={["business"]}>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<DashboardOverview />} />
      <Route path="profile" element={<DashboardProfile />} />
      <Route path="products" element={<DashboardProducts />} />
      <Route path="requests" element={<DashboardRequests />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
