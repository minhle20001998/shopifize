import { MUI, useTheme } from "@shopifize/ui";
import { PropsWithChildren } from "react";
import { Navbar } from "./navbar";
import { Sidenav } from "./sidenav";
import PermissionAlertProvider from "~/contexts/PermissionAlertContext";

export const DashboardLayout = (props: PropsWithChildren) => {
  const theme = useTheme()

  return <MUI.Stack direction={'row'} sx={{ minHeight: '100vh' }}>
    <Sidenav />
    <MUI.Stack flex={1}>
      <Navbar />
      <PermissionAlertProvider>
        <MUI.Box sx={{
          height: 'calc(100vh - 60px)',
          overflow: 'auto',
          backgroundColor: theme.customPalette.backgroundPrimary,
          padding: '1rem'
        }}>
          {props.children}
        </MUI.Box>
      </PermissionAlertProvider>
    </MUI.Stack>
  </MUI.Stack>
}