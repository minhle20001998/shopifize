import { Box, ButtonProps, Drawer, DrawerProps as MuiDrawerProps, Stack } from "@mui/material"
import { CustomButton, CustomTypography } from "..";

interface Props {
  header?: string
  footer?: boolean
  submitBtnProps?: ButtonProps
  cancelBtnProps?: ButtonProps
}

export type DrawerProps = Props & MuiDrawerProps

export const CustomDrawer = (props: DrawerProps) => {
  const { children, header, footer, submitBtnProps, cancelBtnProps, ...delegated } = props;
  return <Drawer {...delegated} sx={{ '& .MuiDrawer-paper': { width: 'clamp(12rem, 20vw, 60rem)' } }}>
    {header
      ? <Box sx={{ padding: '1rem', backgroundColor: (theme) => theme.customPalette.main }}>
        <CustomTypography fontSize={'header4'} sx={{ color: (theme) => theme.customPalette.contrastText, textAlign: 'center' }}>
          {header}
        </CustomTypography>
      </Box>
      : <></>
    }
    <Box sx={{
      padding: '1rem',
      backgroundColor: (theme) => theme.customPalette.grey20,
      height: '100%'
    }}>
      {children}
    </Box>
    {footer
      ?
      <Stack direction={'row'} gap={'1rem'} sx={{padding: '1rem'}}>
        <CustomButton {...submitBtnProps} />
        <CustomButton {...cancelBtnProps} />
      </Stack>
      :
      <></>
    }
  </Drawer>
}