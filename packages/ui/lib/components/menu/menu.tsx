import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  SxProps,
  Theme,
  styled,
} from "@mui/material";
import React, { CSSProperties, useState } from "react";
import { CustomTypography } from "../typography";
import { useRouter } from "next/router";
import { useTheme } from "../../contexts";

export interface SidenavItem<T = string> {
  icon?: React.ReactNode;
  title?: string;
  to?: T;
  items?: SidenavItem<T>[];
  isOpen?: boolean;
  isDynamic?: boolean;
  inVisible?: boolean;
  disabledInteraction?: boolean;
}

function hasChildren(item: SidenavItem<unknown>) {
  const { items: children } = item;

  const filteredChildren = []


  children?.forEach((child) => {
    if (!child.inVisible) {
      filteredChildren.push(child)
    }
  })

  if (children === undefined) {
    return false;
  }

  if (children.constructor !== Array) {
    return false;
  }

  if (filteredChildren.length === 0) {
    return false;
  }

  return true;
}

export interface MenuProp {
  item: SidenavItem<unknown>;
  padding?: CSSProperties['padding']
  textSx?: SxProps<Theme>
}


const CustomListItemIcon = styled(ListItemIcon)(({ theme }) =>
  theme.unstable_sx({
    '&.MuiListItemIcon-root': {
      minWidth: '36px'
    }
  })
);


export const CustomMenuItem = (props: MenuProp) => {
  const { item, padding, textSx } = props;
  const Component = hasChildren(item) ? MultiLevel : SingleLevel;
  return <Component item={item} padding={padding} textSx={textSx} />;
};

const SingleLevel = ({ item, padding, textSx }: MenuProp) => {
  const router = useRouter();
  const theme = useTheme();
  const { items: children, isDynamic } = item;
  const isActive = (isDynamic ? router.asPath.includes(item.to as string) : item.to === router.asPath) || children?.some((child) => {
    return child.inVisible === true && child.to === router.asPath
  });

  const href = item.to ? { href: item.to } : {};

  return (
    <ListItemButton {...href} sx={{ padding: padding ?? '8px 16px' }}>
      {item.icon && <CustomListItemIcon sx={{ color: isActive ? theme.customPalette.main : undefined }}>{item.icon}</CustomListItemIcon>}
      <CustomTypography
        sx={{ color: isActive ? theme.customPalette.main : undefined, ...textSx }}
      >
        {item.title}
      </CustomTypography>
    </ListItemButton>
  );
};

const MultiLevel = ({ item, padding }: MenuProp) => {
  const theme = useTheme();
  const router = useRouter();
  const { items: children } = item;
  const isActive = item.to === router.asPath || children?.some((child) => {
    return (child.isDynamic ? router.asPath.includes(child.to as string) : child.to === router.asPath)
      || (child.inVisible === true && child.to === router.asPath)
  });
  const [open, setOpen] = useState(() => {
    if (item.disabledInteraction || isActive) {
      return true;
    }
    return item.isOpen ?? false;
  });

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const activeColor = isActive ? theme.customPalette.main : undefined

  return (
    <React.Fragment>
      {item.disabledInteraction ? (
        <Box sx={{ padding: padding ?? "8px 16px" }}>
          {item.icon && <CustomListItemIcon sx={{ color: activeColor }}>{item.icon}</CustomListItemIcon>}
          <Box sx={{ width: "100%" }}>
            <CustomTypography
              sx={{
                fontWeight: theme.fontWeight.semiBold,
              }}
            >
              {item.title}
            </CustomTypography>
          </Box>
        </Box>
      ) : (
        <ListItemButton onClick={handleClick} sx={{ padding: padding ?? "8px 16px" }}>
          {item.icon && <CustomListItemIcon sx={{ color: activeColor }}>{item.icon}</CustomListItemIcon>}
          <Box sx={{ width: "100%" }}>
            <CustomTypography
              sx={{
                color: activeColor
              }}
            >
              {item.title}
            </CustomTypography>
          </Box>
          {open ? <ExpandLess sx={{ color: activeColor }} /> : <ExpandMore sx={{ color: activeColor }} />}
        </ListItemButton>
      )}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ paddingLeft: "1rem", paddingRight: '1rem' }}>
          {children?.map((child) => (
            child.inVisible
              ? <React.Fragment key={child.title}></React.Fragment>
              : <CustomMenuItem key={child.title} item={child} padding={padding} />
          ))}
        </List>
      </Collapse>
    </React.Fragment>
  );
};