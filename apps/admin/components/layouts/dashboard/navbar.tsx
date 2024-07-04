import { CustomIconButton, CustomInput, MUI, MUIIcon, useTheme } from "@shopifize/ui"
export const Navbar = () => {
  const theme = useTheme()
  return <nav
    style={{
      display: 'flex',
      alignItems: 'center',
      borderBottom: `2px solid ${theme.customPalette.grey20}`,
      height: '60px',
      padding: '0 1rem',
      gap: '2rem'
    }}
  >
    <MUI.Stack direction={'row'} gap={'2rem'} flexBasis={'400px'}>
      <CustomIconButton >
        <MUIIcon.Menu
          sx={{
            transition: 'color 0.25s ease-in-out',
            '&:hover': { color: theme.customPalette.main }
          }}
        />
      </CustomIconButton>

      <CustomInput placeholder="Search ..." helperTextHidden />
    </MUI.Stack>

    <MUI.Stack direction={'row'} gap={'0.4rem'} flex={'1'} justifyContent={'flex-end'}>
      <CustomIconButton >
        <MUI.Badge
          sx={{
            '& .MuiBadge-badge': { display: 'none' }
          }}
          badgeContent={0}
          color={"error"}
        >
          <MUIIcon.NotificationsOutlined
            sx={{
              transition: 'color 0.25s ease-in-out',
              '&:hover': { color: theme.customPalette.main }
            }}
          />
        </MUI.Badge>
      </CustomIconButton>
      <CustomIconButton >
        <MUI.Avatar sx={{ width: '2rem', height: '2rem' }}>A</MUI.Avatar>
      </CustomIconButton>
    </MUI.Stack>
  </nav>
}