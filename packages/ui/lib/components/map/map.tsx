import { Box } from '@mui/material'
import ReactMapGL from 'react-map-gl'
import { CustomMarker } from './marker'
import { HTMLAttributes, useId, useState } from 'react'
import { FormikProps } from 'formik';
import { useInputFormik } from '../../hooks/use-input-formik';
import { CustomHelperText } from '../helper-text';
import GeocoderControl from './geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Props<T> {
  name?: keyof T;
  arrayName?: string;
  errorMessage?: string | undefined | null;
  helperText?: string;
  formik?: FormikProps<T>;
  accessToken: string;
  ref?: React.ForwardedRef<HTMLDivElement>;
  visuallyHidden?: boolean;
  helperTextHidden?: boolean;
  onMarkerChange?: (lngLat: LngLat) => void;
}

export type CustomMapProps<T> = Props<T> & HTMLAttributes<HTMLDivElement>

export interface LngLat {
  latitude: number
  longitude: number
}

const mapStyleUri = "mapbox://styles/mapbox/outdoors-v12"

//TODO: support formik

export const CustomMap = <T,>(props: CustomMapProps<T>) => {
  const {
    accessToken,
    id: idProp,
    name,
    arrayName,
    errorMessage,
    helperText,
    helperTextHidden,
    visuallyHidden,
    formik,
    onMarkerChange
  } = props
  const [markerPosition, setMarkerPosition] = useState<LngLat | null>(null)
  let id = useId();
  const helperTextId = useId();
  id = idProp ?? id;

  const { inputName, formikErrorMessage, isError, value } = useInputFormik<T, LngLat | undefined>({
    name: name?.toString(),
    arrayName,
    formik
  })

  const markerPositionValue = value ?? markerPosition

  const handleFormikChange = (values: LngLat) => {
    formik?.setFieldValue(inputName.toString(), values)
  }

  const initialViewState = {
    latitude: markerPositionValue?.latitude ?? 21.0278,
    longitude: markerPositionValue?.longitude ?? 105.8342,
    zoom: markerPositionValue ? 15 : 9
  }

  return <>
    <Box
      id={id}
    >
      <ReactMapGL
        mapLib={import('mapbox-gl')}
        mapboxAccessToken={accessToken}
        initialViewState={initialViewState}
        style={{
          width: '100%',
          height: 400
        }}
        mapStyle={mapStyleUri}
        onDblClick={(e) => {
          e.preventDefault()
          const lngLat = {
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng
          }
          setMarkerPosition(lngLat)
          onMarkerChange?.(lngLat)
          handleFormikChange(lngLat)
        }}
      >
        {markerPositionValue
          ? <CustomMarker
            anchor="bottom"
            latitude={markerPositionValue.latitude}
            longitude={markerPositionValue.longitude}
          />
          : <></>
        }
        <GeocoderControl mapAccessToken={accessToken} position="top-left"/>
      </ReactMapGL>
      <CustomHelperText
        helperTextId={helperTextId}
        isError={isError}
        errorMessage={errorMessage}
        formikErrorMessage={formikErrorMessage}
        helperText={helperText}
        helperTextHidden={helperTextHidden}
        visuallyHidden={visuallyHidden}
      />
    </Box>
  </>
}