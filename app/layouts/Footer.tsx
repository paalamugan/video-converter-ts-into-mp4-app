import { Link, Stack, Text, useColorModeValue } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Stack py={5} justify="center" align="center">
      <Text fontWeight={"500"} fontSize={"md"}>
        © 2023 Video Converter Ts Into MP4. Created by{" "}
        <Link
          href="https://paalamugan.com"
          target="_blank"
          color={useColorModeValue("blue.500", "blue.200")}
        >
          paalamugan
        </Link>
      </Text>
    </Stack>
  );
};

export default Footer;
