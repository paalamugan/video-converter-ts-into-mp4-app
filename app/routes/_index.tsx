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
import { useEffect } from "react";

const tmpVideoIds = new Set();

export default function Index() {
  const videoFetcher = useFetcher();
  const deleteFetcher = useFetcher();
  const isLoading = videoFetcher.state === "submitting";
  const { url, format } = videoFetcher.data || {};
  const error = videoFetcher.data?.error;

  useEffect(() => {
    if (!url) return;
    const videoId = url.split("/").at(-1) as string;
    if (videoId) {
      tmpVideoIds.add(videoId);
    }
  }, [url]);

  useEffect(() => {
    const listener = (event: Event) => {
      const videoIds = [...tmpVideoIds];
      if (!videoIds.length) return;
      const params = new URLSearchParams();
      params.set("ids", videoIds.join(","));
      deleteFetcher.load(`/api/delete-video?${params}`);
    };

    window.addEventListener("beforeunload", listener);
    return () => {
      window.removeEventListener("beforeunload", listener);
    };
  }, [deleteFetcher]);

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
              User Section
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
                Video Section
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
