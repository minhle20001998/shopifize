import { styled, SxProps, Theme } from "@mui/material"
import { PropsWithChildren } from "react"

const Button = styled('button')()

export const InvisibleButton = (props: PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>> & { sx?: SxProps<Theme> }) => {
  const { children, sx, ...buttonProps } = props
  return <Button sx={{
    border: 'none',
    margin: 0,
    padding: 0,
    background: 'transparent',
    WebkitAppearance: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    ...sx
  }} {...buttonProps}>{children}</Button>
}