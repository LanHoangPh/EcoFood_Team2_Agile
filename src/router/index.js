import { createRouter, createWebHistory } from "vue-router";

// Xác thực
import Login from "../views/auth/Login.vue";
import Register from "../views/auth/Register.vue";

// Customer Components
import Home from "../views/customer/Home.vue";
import Products from "../views/customer/Products.vue";
import ProductDetail from "../views/customer/ProductDetail.vue";
import Cart from "../views/customer/Cart.vue";
import Checkout from "../views/customer/Checkout.vue";
import Profile from "../views/customer/Profile.vue";
import OrderHistory from "../views/customer/OrderHistory.vue";
import OrderDetail from "../views/customer/OrderDetail.vue";
import HelpCenter from "../views/customer/HelpCenter.vue";

// Admin Components
import AdminDashboard from "../views/admin/Dashboard.vue";
import AdminProducts from "../views/admin/AdminProducts.vue";
import AdminCategories from "../views/admin/AdminCategories.vue";
import AdminOrders from "../views/admin/AdminOrders.vue";
import AdminUsers from "../views/admin/AdminUsers.vue";
import AdminReports from "../views/admin/AdminReports.vue";

// Route Guards
const requireAuth = (to, from, next) => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return next("/auth/login");
  next();
};

const requireAdmin = (to, from, next) => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user || user.role !== "admin") return next("/auth/login");
  next();
};

const routes = [
  { path: "/auth/login", component: Login },
  { path: "/auth/register", component: Register },

  {
    path: "/",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/products",
    component: Products,
    meta: { requiresAuth: true },
  },
  {
    path: "/products/:id",
    component: ProductDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/cart",
    component: Cart,
    meta: { requiresAuth: true },
  },
  {
    path: "/checkout",
    component: Checkout,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/orders",
    component: OrderHistory,
    meta: { requiresAuth: true },
  },
  {
    path: "/orders/:id",
    component: OrderDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/help",
    component: HelpCenter,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/dashboard",
    component: AdminDashboard,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/products",
    component: AdminProducts,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/categories",
    component: AdminCategories,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/orders",
    component: AdminOrders,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/users",
    component: AdminUsers,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/reports",
    component: AdminReports,
    meta: { requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    requireAuth(to, from, next);
  } else if (to.meta.requiresAdmin) {
    requireAdmin(to, from, next);
  } else {
    next();
  }
});

export default router;
