import { CustomMenuItem, Logo, MUI, useTheme } from "@shopifize/ui"
import { SidenavMenus } from "~/const"


export const Sidenav = () => {
  const theme = useTheme()

  return <nav style={{
    width: "300px",
    borderRight: `2px solid ${theme.customPalette.grey20}`
  }}>
    <MUI.Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '60px',
      borderBottom: `2px solid ${theme.customPalette.grey20}`,

    }}>
      <Logo size="sm" hasLogo={false} />
    </MUI.Box>

    <MUI.Box sx={{ padding: '1rem 0' }}>
      {SidenavMenus.map((item) => (
        <CustomMenuItem key={item.title} item={item} padding={'14px 20px'}/>
      ))}
    </MUI.Box>
  </nav>
}