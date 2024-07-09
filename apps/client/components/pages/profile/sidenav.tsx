import { CustomMenuItem, SidenavItem } from "@shopifize/ui";
import { ProfileRoutes } from "const/routes";
import React from "react";

export const menu: SidenavItem<ProfileRoutes>[] = [
  {
    title: "My Account",
    isOpen: true,
    disabledInteraction: false,
    items: [
      { title: "Profile", to: ProfileRoutes.PROFILE },
      { title: "Addresses", to: ProfileRoutes.ADDRESS },
      { title: "Change Password", to: ProfileRoutes.CHANGE_PASSWORD },
      { title: "Account Log", to: ProfileRoutes.ACCOUNT_LOG },
    ],
  },
  {
    title: "My Purchase",
    isOpen: true,
    disabledInteraction: false,
    items: [{ title: "Orders", to: ProfileRoutes.ORDERS }],
  },
];

export const ProfileSidenav = () => {
  return (
    <aside>
      {menu.map((item) => (
        <CustomMenuItem key={item.title} item={item} />
      ))}
    </aside>
  );
};
