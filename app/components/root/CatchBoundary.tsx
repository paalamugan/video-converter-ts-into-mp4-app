import {
  Box,
  Button,
  Heading,
  Image,
  Stack,
  Text,
  useColorMode,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useCatch } from "@remix-run/react";
import type { CatchBoundaryComponent } from "@remix-run/react";

import { Document } from "./Document";

import MotionBox from "@/components/ motion/Box";

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();
  const { colorMode } = useColorMode();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <Text>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </Text>
      );
      break;
    case 404:
      message = (
        <Text>
          Oops! Looks like you tried to visit a page that does not exist.
        </Text>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Stack alignItems="center" justify="center" height="full">
        <MotionBox
          animate={{ y: 20 }}
          transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
          width={["100%", "70%", "60%", "60%"]}
          margin="0 auto"
        >
          <Image
            src="/not-found.jpg"
            alt="Error 404 not found Illustration"
            width="30rem"
            mx="auto"
          />
        </MotionBox>

        <Box py={10}>
          <Box textAlign="center">
            <Heading>
              {caught.status}: {caught.statusText}
            </Heading>

            <Text as="div">{message}</Text>
          </Box>

          <Box textAlign="center" marginTop={4}>
            <ChakraLink href="/">
              <Button
                backgroundColor={
                  colorMode === "light" ? "gray.300" : "teal.500"
                }
              >
                Go to Home
              </Button>
            </ChakraLink>
          </Box>
        </Box>
      </Stack>
    </Document>
  );
};

export default CatchBoundary;
