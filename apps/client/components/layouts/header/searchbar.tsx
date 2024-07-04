import {
  CustomAutoComplete,
  CustomIconButton,
  CustomLink,
  MUI,
  MUIIcon,
  SxProps,
  Theme,
  useTheme,
} from "@shopifize/ui";
import React, { useState } from "react";

const searchedTexts = [
  "Razer hammerhead v2",
  "Nintendo 3ds",
  "PSP 1000",
  "Bluetooth keyboard",
  "Bluetooth mouse",
];

const items = ["ran", "asd", "qweqw", "qwzxc", "ckwioqw", "zizuki"];

const autocompleteIconStyle: SxProps<Theme> = {
  fontSize: "20px",
  color: "text.secondary",
};

const Searchbar = () => {
  const [isFocused, setFocus] = useState(false);
  const [isHovered, setHover] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(searchedTexts);
  const isSearching = inputValue !== "";
  const theme = useTheme();

  // useEffect(() => {
  //   if (inputValue === "") {
  //     setOptions(searchedTexts);
  //     return;
  //   }

  //   setOptions(() => items.filter((v) => v.startsWith(inputValue)));
  // }, [inputValue]);

  const isHightLight = isFocused ? true : isHovered ? true : false;

  const handleInputChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setInputValue(value);
    if (value === "") {
      setOptions(searchedTexts);
    } else {
      setOptions(() => items.filter((v) => v.startsWith(value)));
    }
  };

  return (
    <MUI.Box
      sx={{
        flex: 1,
        "& .MuiAutocomplete-popper": {
          marginTop: "16px !important",
          backgroundColor: theme.customPalette.white,
        },
        "& .MuiPaper-rounded": {
          borderRadius: "0 !important",
        },
      }}
    >
      <CustomAutoComplete
        disablePortal
        freeSolo
        options={options}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        value={inputValue}
        onInputChange={handleInputChange}
        filterOptions={(options) => options}
        renderOption={(props, option) => {
          return (
            <li {...props}>
              <MUI.Stack direction={"row"} alignItems={"center"} gap={"8px"}>
                {isSearching ? (
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  <MUIIcon.Search sx={autocompleteIconStyle} />
                ) : (
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  <MUIIcon.AccessTime sx={autocompleteIconStyle} />
                )}
                <MUI.Box
                  sx={{
                    color: "text.secondary",
                    fontSize: "14px",
                  }}
                >
                  {option}
                </MUI.Box>
              </MUI.Stack>
            </li>
          );
        }}
        renderInput={(params) => {
          return (
            <div
              onMouseOver={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              style={{
                flex: 1,
              }}
              ref={params.InputProps.ref}
            >
              <MUI.Box
                className="search-bar-wrapper"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderColor: isHightLight
                    ? theme.customPalette.main
                    : `grey.300`,
                  borderRadius: "8px",
                  padding: "4px 12px",
                  height: "36px",
                  transition: "all 0.5s",
                  marginTop: {
                    xs: "8px",
                    sm: "8px",
                    md: "8px",
                    lg: "28px",
                    xl: "28px",
                  },
                }}
              >
                <MUI.Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <input
                    style={{
                      border: "none",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                    placeholder="What do you want to buy ?"
                    {...params.inputProps}
                  />
                </MUI.Box>
                <CustomIconButton
                  aria-label="search product button"
                  sx={{ padding: "4px 8px", borderRadius: "8px" }}
                >
                  <MUIIcon.Search
                    sx={{
                      color: isHightLight
                        ? theme.customPalette.main
                        : "grey.300",
                      transition: "color 0.5s",
                    }}
                  />
                </CustomIconButton>
              </MUI.Box>
              <MUI.Stack
                direction={"row"}
                marginTop={"8px"}
                gap={"12px"}
                sx={{
                  display: {
                    xs: "none",
                    sm: "none",
                    md: "none",
                    lg: "flex",
                    xl: "flex",
                  },
                }}
              >
                {searchedTexts.map((searchedText, index) => {
                  return (
                    <CustomLink
                      key={index}
                      href={"/"}
                      hoverStyle="color"
                      variant="secondary"
                      sx={{
                        color: "text.disabled",
                      }}
                    >
                      {searchedText}
                    </CustomLink>
                  );
                })}
              </MUI.Stack>
            </div>
          );
        }}
      />
    </MUI.Box>
  );
};

export default Searchbar;
