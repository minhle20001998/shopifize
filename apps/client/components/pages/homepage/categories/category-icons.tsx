import { FaTshirt } from "react-icons/fa";
import {
  GiLargeDress,
  GiDropEarrings,
  GiSmartphone,
  GiFamilyHouse,
  GiPc,
  GiMedicinePills,
  GiBookshelf,
  GiRobotGolem,
  GiBeachBag,
} from "react-icons/gi";
import React from "react";
import { IconType } from "react-icons";
import { MdPets } from "react-icons/md";
import { MUI } from "@shopifize/ui";

export const CATEGORY_ICON_SIZE = "32px";

const renderIcon = (icon: IconType) => {
  return MUI.styled(icon)(({ theme }) =>
    theme.unstable_sx({
      color: theme.customPalette.grey80,
      width: CATEGORY_ICON_SIZE,
      height: CATEGORY_ICON_SIZE,
    })
  );
};

const TshirtIcon = renderIcon(FaTshirt);
const DressIcon = renderIcon(GiLargeDress);
const EarringsIcon = renderIcon(GiDropEarrings);
const SmartphoneIcon = renderIcon(GiSmartphone);
const HouseIcon = renderIcon(GiFamilyHouse);
const PCIcon = renderIcon(GiPc);
const MedicineIcon = renderIcon(GiMedicinePills);
const BookshelfIcon = renderIcon(GiBookshelf);
const RobotIcon = renderIcon(GiRobotGolem);
const GroceryIcon = renderIcon(GiBeachBag);
const PetIcon = renderIcon(MdPets);

const categoryIcons: { [key: string]: React.ReactNode } = {
  "men clothes": <TshirtIcon />,
  "women clothes": <DressIcon />,
  "fashion accessories": <EarringsIcon />,
  "mobile gadgets": <SmartphoneIcon />,
  "home & living": <HouseIcon />,
  "computer & accessories": <PCIcon />,
  health: <MedicineIcon />,
  books: <BookshelfIcon />,
  toys: <RobotIcon />,
  grocery: <GroceryIcon />,
  pets: <PetIcon />,
};

export default categoryIcons;
