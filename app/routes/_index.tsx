import {
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { ImSearch } from "react-icons/im";
import { InputURL } from "@/components/inputs/InputURL";
import { SelectFormat } from "@/components/inputs/SelectFormat";
import { DownloadOptions } from "@/components/DownloadOptions";
import { VideoSection } from "@/components/VideoSection";

export default function Index() {
  const videoFetcher = useFetcher();

  const isLoading = videoFetcher.state === "submitting";
  const { url, format } = videoFetcher.data || {};
  const error = videoFetcher.data?.error;

  return (
    <Container maxW="full" py={10}>
      <Grid
        gap={10}
        alignItems={"start"}
        templateColumns={{ md: "repeat(2, 1fr)" }}
      >
        <GridItem display="grid" gap={4}>
          <Stack>
            <Heading as="h3" size="md" py={"4px"}>
              Enter Information
            </Heading>
            <Divider
              borderColor={useColorModeValue("gray.400", "gray.500")}
              borderRadius="base"
            />
          </Stack>
          <videoFetcher.Form method="post" action="/api/video-converter">
            <VStack gap={4} alignItems={"start"}>
              <InputURL />
              <SelectFormat />
              <Button
                colorScheme="green"
                type="submit"
                isLoading={isLoading}
                loadingText="Searching..."
                leftIcon={<ImSearch />}
              >
                Search
              </Button>
            </VStack>
          </videoFetcher.Form>
        </GridItem>
        <GridItem ml={{ md: 8 }} display="grid" gap={6}>
          <Stack>
            <Flex justify="space-between" align="center">
              <Heading as="h2" size="md">
                Show Video
              </Heading>
              <DownloadOptions url={url} format={format} />
            </Flex>
            <Divider
              borderColor={useColorModeValue("gray.400", "gray.500")}
              borderRadius="base"
            />
          </Stack>
          <VideoSection isLoading={isLoading} data={url} error={error} />
        </GridItem>
      </Grid>
    </Container>
  );
}
