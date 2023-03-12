import { Box, Center, Skeleton, Stack, Text, VStack } from "@chakra-ui/react";
import type { FC } from "react";

export interface VideoSectionProps {
  data?: string;
  isLoading: boolean;
  error?: {
    message: string;
  };
}

export const VideoSection: FC<VideoSectionProps> = ({
  data,
  error,
  isLoading,
}) => {
  if (isLoading)
    return (
      <Box height="xs" width="full">
        <Skeleton height="full" borderRadius="md" />
      </Box>
    );
  if (error)
    return (
      <Center>
        <Text size={"1rem"} color="red" wordBreak="break-word">
          {error.message}
        </Text>
      </Center>
    );
  if (!data)
    return (
      <Center mt={20}>
        <Text size={"2rem"}>
          Please{" "}
          <strong>
            <i>enter a url</i>
          </strong>{" "}
          and click{" "}
          <strong>
            <i>search button</i>
          </strong>{" "}
          to see the video.
        </Text>
      </Center>
    );

  return (
    <VStack alignItems="stretch" gap={4}>
      <Stack align="center" w="full" height="sm">
        <video
          controls
          src={data}
          style={{ height: "100%", width: "100%" }}
          autoPlay
        >
          your browser does not support the video tag
        </video>
      </Stack>
    </VStack>
  );
};
