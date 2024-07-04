import { Box } from '@mui/material'
import { Marker, MarkerProps } from 'react-map-gl'

export const CustomMarker = (props: MarkerProps) => {
  return <Marker anchor="bottom" {...props}>
    <Box
      sx={{
        backgroundImage: 'url(http://shopifized.s3-website-ap-southeast-1.amazonaws.com/common/marker.png)',
        backgroundSize: 'cover',
        width: '30px',
        height: '41px'
      }}
    />
  </Marker>
}