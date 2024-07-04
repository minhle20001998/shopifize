import { Box, FormHelperText } from "@mui/material";

export interface Props {
  isError: boolean
  helperTextId: string
  errorMessage?: string | undefined | null
  formikErrorMessage?: string
  helperTextHidden?: boolean
  visuallyHidden?: boolean
  helperText?: string
}

export const CustomHelperText = (props: Props) => {

  const { isError,
    helperTextId,
    errorMessage,
    formikErrorMessage,
    helperTextHidden,
    visuallyHidden,
    helperText
  } = props;

  return <>
    {isError ? (
      <FormHelperText
        id={helperTextId}
        sx={{ padding: 0, margin: 0, marginTop: "4px" }}
      >
        {
          errorMessage
            ? errorMessage
            : formikErrorMessage?.toString()
        }
      </FormHelperText >
    ) : (
      !helperTextHidden ? <Box sx={{ height: "24px" }}>
        <FormHelperText
          id={helperTextId}
          sx={{ padding: 0, margin: 0, marginTop: "4px" }}
          className={visuallyHidden ? "visually-hidden" : ""}
        >
          {helperText}
        </FormHelperText>
      </Box> : <></>
    )
    }
  </>
}