import { extendTheme } from "@chakra-ui/react";

import { colors } from "./colors";
import { components } from "./components";
import { fonts } from "./fonts";

const customTheme = extendTheme({
  fonts,
  colors,
  components,
});

export default customTheme;

export type ThemeColorMode = "dark" | "light" | "system" | undefined;
// here we can set the default color mode. If we set it to null,
// there's no way for us to know what is the the user's preferred theme
// so the client will have to figure out and maybe there'll be a flash the first time the user visits us.
export const DEFAULT_COLOR_MODE: ThemeColorMode = "light";

export const CHAKRA_COOKIE_COLOR_KEY = "chakra-ui-color-mode";

export const getColorMode = (cookies: string) => {
  const match = cookies.match(
    new RegExp(`(^| )${CHAKRA_COOKIE_COLOR_KEY}=([^;]+)`)
  );
  return match == null ? void 0 : (match[2] as ThemeColorMode);
};
