import HomeView from "@/views/home/index.vue";
import UserView from "@/views/user/index.vue";
import UserCreateView from "@/views/user/create.vue";
import UserUpdateView from "@/views/user/update.vue";
import ProductView from "@/views/product/index.vue";
import ProductCreateView from "@/views/product/create.vue";
import CartView from "@/views/cart/index.vue";
import CheckoutView from "@/views/checkout/index.vue";
import TransactionConfirmationView from "@/views/checkout/confirmation.vue";
import TransactionListView from "@/views/checkout/list.vue";

import ExampleLayout from "@/layouts/ExampleLayout.vue";

// middleware
import AuthMiddleware from "@/middleware/auth.middleware.js";

export default [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      title: "Home",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: "/user",
    name: "user",
    component: UserView,
    meta: {
      title: "User",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: "/user/create",
    name: "user.create",
    component: UserCreateView,
    meta: {
      title: "User Create",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: "/user/update",
    name: "user.update",
    component: UserUpdateView,
    meta: {
      title: "User Update",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: "/product",
    name: "product",
    component: ProductView,
    meta: {
      title: "Product",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: "/product/create",
    name: "product.create",
    component: ProductCreateView,
    meta: {
      title: "Product Create",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: "/cart",
    name: "Cart",
    component: CartView,
    meta: {
      title: "Cart",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: "/checkout",
    name: "checkout",
    component: CheckoutView,
    meta: {
      title: "Checkout",
      layout: ExampleLayout,
      middleware: [AuthMiddleware]
    }
  },
  {
    path: "/transaction/confirmation/:id",
    name: "transaction-confirmation",
    component: TransactionConfirmationView,
    meta: {
      title: "Confirmation",
      layout: ExampleLayout,
      middleware: [AuthMiddleware]
    }
  },
  {
    path: "/transaction/list",
    name: "transaction-list",
    component: TransactionListView,
    meta: {
      title: "List",
      layout: ExampleLayout,
      middleware: [AuthMiddleware]
    }
  },
];
