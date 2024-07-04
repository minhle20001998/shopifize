import { MUI } from "@shopifize/ui";
import { ScreenSize } from "const/screen-size";

function useMobileScreen(breakpoint: ScreenSize = ScreenSize.sm) {
  const isMobileSize = MUI.useMediaQuery(`(max-width:${breakpoint}px)`);

  return isMobileSize;
}

export default useMobileScreen;
