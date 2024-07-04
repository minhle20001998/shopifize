import { MUI, MUIIcon } from "@shopifize/ui"
import { HTMLAttributes } from "react"

export const AddProductButton = (props: HTMLAttributes<HTMLButtonElement>) => {
  return <MUI.ButtonBase sx={{
    width: '100%',
    height: '60px',
    border: '1px dashed black',
    backgroundColor: theme => theme.customPalette.main10,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.25s',
    '&:hover': {
      backgroundColor: theme => theme.customPalette.main20,
      border: (theme) => `1px dashed ${theme.customPalette.main}`
    },
    '&:hover svg': {
      color: (theme) => theme.customPalette.main
    }
  }}
    {...props}
  >
    <MUIIcon.Add />
  </MUI.ButtonBase>
}