import { Card, CardProps } from "@mui/material"

export const CustomCard = (props: CardProps) => {
  const {sx, children, ...cardProps} = props;
  return <Card sx={{...sx, padding: '1rem', boxShadow: (theme) => theme.boxShadows.depth4}} {...cardProps}>{children}</Card>
}