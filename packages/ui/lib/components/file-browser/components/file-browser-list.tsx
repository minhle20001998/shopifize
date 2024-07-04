import { ButtonBase, Grid, styled } from "@mui/material";
import { CustomIconButton } from "../..";
import { Add, HighlightOff } from "@mui/icons-material";
import { BucketObject, isEmpty } from "@shopifize/helpers";

interface Props {
  isMultiple: boolean
  selectedFiles?: BucketObject[]
  listPreviewImages?: string[]
  handleRemoveImage?: (index: number) => void
}

export const Image = styled('img')(({ theme }) =>
  theme.unstable_sx({
    width: '100%',
    height: '100%',
    maxHeight: '300px',
    border: `2px solid ${theme.customPalette.grey50}`,
    borderStyle: 'dashed',
    borderRadius: '8px',
    objectFit: 'contain',
    '&:hover': {
      border: `2px solid ${theme.customPalette.main}`,
      borderStyle: 'dashed',
    }
  })
);


export const FileBrowserList = (props: Props) => {
  const { isMultiple, selectedFiles, listPreviewImages, handleRemoveImage } = props;

  const hasValue = !isEmpty(selectedFiles) || !isEmpty(listPreviewImages)

  const isUsingExternalValues = !!listPreviewImages

  return <>
    <Grid
      container
      spacing={'1rem'}
      sx={{
        minHeight: '160px',
        minWidth: '180px'
      }}
    >
      {isUsingExternalValues
        ? listPreviewImages?.map((link, index) => {
          return <FileBrowserListItem
            isMultiple={isMultiple}
            index={index}
            src={link}
            alt={link}
            onDeleteClick={handleRemoveImage}
            onImageClick={() => { }}
          />
        })
        : selectedFiles?.map((file, index) => {
          return <FileBrowserListItem
            isMultiple={isMultiple}
            index={index}
            src={file.thumbnailUrl}
            alt={file.originalName}
            onDeleteClick={handleRemoveImage}
            onImageClick={() => { }}
          />
        })
      }
      {!hasValue || isMultiple ? <Grid
        item
        xl={isMultiple ? 2 : 12}
        lg={isMultiple ? 4 : 12}
        xs={isMultiple ? 6 : 12}
      >
        <ButtonBase
          sx={{
            border: (theme) => `2px solid ${theme.customPalette.grey50}`,
            borderStyle: 'dashed',
            borderRadius: '8px',
            height: '100%',
            width: '100%',
            '&:hover, &:focus-visible': {
              border: (theme) => `2px solid ${theme.customPalette.main}`,
              borderStyle: 'dashed',
            },
            '&:hover #add-image-icon, &:focus-visible #add-image-icon': {
              color: (theme) => theme.customPalette.main
            }
          }}
        >
          <Add
            id="add-image-icon"
            sx={{
              fontSize: '3rem',
              minHeight: '160px',
            }}
          />
        </ButtonBase>
      </Grid> : <></>}
    </Grid>
  </>
}

interface FileBrowserListProps {
  isMultiple?: boolean
  index: number
  src?: string
  alt?: string
  onImageClick?: () => void
  onDeleteClick?: (index: number) => void
}

const FileBrowserListItem = (props: FileBrowserListProps) => {
  const { isMultiple, alt, index, src, onDeleteClick, onImageClick } = props;
  return <Grid
    item
    xl={isMultiple ? 2 : 12}
    lg={isMultiple ? 4 : 12}
    xs={isMultiple ? 6 : 12}
    sx={{
      position: 'relative'
    }}
  >
    <Image
      src={src}
      title={src}
      alt={`Image ${alt}`}
      onClick={(e) => {
        e.stopPropagation()
        onImageClick?.()
      }}
      style={{

      }}
    />
    <CustomIconButton
      sx={{
        position: 'absolute',
        top: 0,
        right: -16,
        '&:hover svg': {
          color: (theme) => theme.customPalette.errorStatus,
        }
      }}
      onClick={(e) => {
        e.stopPropagation()
        onDeleteClick?.(index);
      }}
    >
      <HighlightOff sx={{
        borderRadius: '100%',
        backgroundColor: (theme) => theme.customPalette.white,
      }}
      />
    </CustomIconButton>
  </Grid>
}