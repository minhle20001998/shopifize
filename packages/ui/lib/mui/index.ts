import * as a from '@mui/material'
import omit from 'lodash.omit'

export const MUI = omit(a, ['ThemeProvider'])

export type { BoxProps, SxProps, Theme, TooltipProps, AvatarProps } from '@mui/material'
