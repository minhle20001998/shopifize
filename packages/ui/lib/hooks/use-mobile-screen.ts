import { useMediaQuery } from "@mui/material";
import { ScreenSize } from "../const";

function useMobileScreen(breakpoint: ScreenSize = ScreenSize.sm) {
  const isMobileSize = useMediaQuery(`(max-width:${breakpoint}px)`);

  return isMobileSize;
}

export default useMobileScreen;
