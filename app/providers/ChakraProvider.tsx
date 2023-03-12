import {
  ChakraProvider as OriginalChakraProvider,
  cookieStorageManagerSSR,
} from "@chakra-ui/react";

import customTheme from "@/styles/theme";

type ProvidersProps = {
  children: React.ReactNode;
  cookies: string;
};

const ChakraProvider = ({ children, cookies }: ProvidersProps) => {
  return (
    <OriginalChakraProvider
      theme={customTheme}
      colorModeManager={cookieStorageManagerSSR(cookies)}
    >
      {children}
    </OriginalChakraProvider>
  );
};

export default ChakraProvider;
