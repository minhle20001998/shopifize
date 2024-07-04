import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from "../../../contexts";
import { CustomTypography } from "../..";

interface Props {
  uploadFiles: FileList | undefined
}

export const ViewUploadFiles = (props: Props) => {
  const { uploadFiles } = props;
  const [imageList, setImageList] = useState<{ file: File, dataURL: string }[]>([])
  const theme = useTheme()

  useEffect(() => {
    const handleReadFile = () => {
      if (!uploadFiles) {
        return
      }
      const imagesArray = Array.from(uploadFiles).map((file) => {
        const reader = new FileReader();

        // Read the content of the file as a data URL
        reader.readAsDataURL(file);

        // Return a promise to handle the asynchronous file reading
        return new Promise((resolve) => {
          reader.onload = () => {
            // Resolve with an object containing file information and data URL
            resolve({
              file,
              dataURL: reader.result,
            });
          };
        });
      });

      Promise.all(imagesArray).then((images) => {
        // Update the state with the array of file information and data URLs
        setImageList(images as { file: File, dataURL: string }[]);
      });
    }

    handleReadFile()
  }, [uploadFiles])

  return <>
    <Grid container spacing={'1rem'}>
      {imageList.map((image, index) => {
        return <>
          <Grid xs={4} item sx={{
          }}>
            <img
              key={index}
              src={image.dataURL}
              alt={`Image ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '120px',
                border: `2px solid ${theme.customPalette.grey50}`,
                borderStyle: 'dashed',
                borderRadius: '8px',
                objectFit: 'contain'
              }}
            />
            <CustomTypography style={{textAlign: 'center'}}>{image.file.name}</CustomTypography>
          </Grid>
        </>
      })}
    </Grid>
  </>
}