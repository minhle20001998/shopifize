import { MUIIcon, SidenavItem } from "@shopifize/ui";
import { Routes } from "./routes";

export const SidenavMenus: SidenavItem<Routes>[] = [
  {
    title: "Dashboard",
    disabledInteraction: false,
    to: Routes.DASHBOARD,
    icon: <MUIIcon.Home />
  },
  {
    title: "Users",
    disabledInteraction: false,
    to: Routes.USERS,
    icon: <MUIIcon.Person />
  },
  {
    title: 'Products',
    disabledInteraction: false,
    to: Routes.PRODUCTS,
    icon: <MUIIcon.Inventory />,
    items: [
      {
        title: 'Add',
        to: Routes.ADD_PRODUCTS,
        inVisible: true
      },
      {
        title: 'Stocks',
        to: Routes.PRODUCTS,
        icon: <MUIIcon.Warehouse />,
        inVisible: false
      },
      {
        title: 'Categories',
        to: Routes.CATEGORIES,
        icon: <MUIIcon.Category />,
        inVisible: false,
        isDynamic: true
      },
    ]
  },
  {
    title: 'Orders',
    disabledInteraction: false,
    to: Routes.ORDERS,
    icon: <MUIIcon.ShoppingCart />
  },
  {
    title: 'Transactions',
    disabledInteraction: false,
    to: Routes.TRANSACTIONS,
    icon: <MUIIcon.CreditCard />
  }
];