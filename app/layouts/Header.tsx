import type { FlexProps } from "@chakra-ui/react";
import { Box, Flex, HStack, Heading } from "@chakra-ui/react";

import ThemeToggle from "./ThemeToggle";

export const Header = (props: FlexProps) => {
  return (
    <Flex
      height="16"
      alignItems="center"
      justifyContent={{ base: "space-between" }}
      {...props}
    >
      <Box display={{ base: "flex" }}>
        {/* <Image src={logo} alt="logo" width={40} height={40} /> */}
        <Heading as={"h1"} size="lg" ml={2}>
          Video Converter Ts Into Mp4
        </Heading>
      </Box>

      <HStack spacing={{ base: "0", md: "3" }}>
        <ThemeToggle />
      </HStack>
    </Flex>
  );
};

export default Header;
