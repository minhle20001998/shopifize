import { Autocomplete, AutocompleteProps } from "@mui/material";

type Props<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>;

export const CustomAutoComplete = <
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false
>(
  props: Props<T, Multiple, DisableClearable, FreeSolo>
) => {
  const { ref, ...delegated } = props;

  return <Autocomplete ref={ref} {...delegated} />;
};

CustomAutoComplete.displayName = "CustomButton";