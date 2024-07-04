import { OutlinedInput, styled } from "@mui/material";

export const BaseInput = styled(OutlinedInput)(({ theme }) =>
  theme.unstable_sx({
    "& input": {
      padding: "10px",
    },
    "& fieldset": {
      border: "1px solid rgba(0,0,0,.14)",
    },
    fontSize: "14px",
  })
);
