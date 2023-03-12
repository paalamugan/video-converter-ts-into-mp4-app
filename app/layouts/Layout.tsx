import { Container, Grid, GridItem, useColorModeValue } from "@chakra-ui/react";
import type { FC, PropsWithChildren } from "react";

import Footer from "./Footer";
import Header from "./Header";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Grid
      templateAreas={{
        base: `
            "header header"
            "main main"
            "footer footer"
          `,
      }}
      gridTemplateRows={"auto 1fr auto"}
      gridTemplateColumns={"1fr"}
      minH="100dvh"
    >
      <GridItem
        area={"header"}
        as="header"
        bg={useColorModeValue("white", "gray.900")}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Container maxW="full">
          <Header />
        </Container>
      </GridItem>
      <GridItem
        area={"main"}
        as="main"
        bg={useColorModeValue("white", "gray.900")}
        color={useColorModeValue("gray.900", "gray.200")}
      >
        <Container maxW="full" height={"full"}>
          {children}
        </Container>
      </GridItem>
      <GridItem
        area={"footer"}
        as="footer"
        bg={useColorModeValue("white", "gray.900")}
        borderTopWidth="1px"
        borderTopColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Container maxW="full">
          <Footer />
        </Container>
      </GridItem>
    </Grid>
  );
};

export default Layout;
