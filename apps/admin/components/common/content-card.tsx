import { CustomTypography, MUI, useTheme } from '@shopifize/ui'
import React, { PropsWithChildren } from 'react'

interface ContentCardProps extends PropsWithChildren {

}

const ContentCard = (props: ContentCardProps) => {
  const theme = useTheme()

  return (
    <MUI.Card
      sx={{
        padding: '1rem',
        boxShadow: theme.boxShadows.depth4
      }}
    >
      {props.children}
    </MUI.Card>
  )
}

export const ContentCardHeader = (props: PropsWithChildren) => {
  return <MUI.Stack direction={'row'} justifyContent={'space-between'}>
    {props.children}
  </MUI.Stack>
}

export const ContentCardTitle = (props: PropsWithChildren) => {
  const theme = useTheme()

  return <CustomTypography
    sx={{
      fontSize: '18px',
      marginBottom: '1rem'
    }}
  >
    {props.children}
  </CustomTypography>
}

export const ContentCardBody = (props: PropsWithChildren) => {
  return <MUI.Box sx={{ paddingTop: '1rem' }}>{props.children}</MUI.Box>
}

ContentCard.Body = ContentCardBody
ContentCard.Title = ContentCardTitle
ContentCard.Header = ContentCardHeader

export default ContentCard as typeof ContentCard & {
  Title: typeof ContentCardTitle
  Body: typeof ContentCardBody
  Header: typeof ContentCardHeader
}
