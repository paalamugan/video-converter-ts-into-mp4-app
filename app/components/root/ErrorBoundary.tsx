import { Heading, Flex } from "@chakra-ui/react";
import Document from "./Document";
import { useMatchesData } from "@/utils/utils";

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  const cookies = useMatchesData("root") as unknown as string;
  return (
    <Document title="Error!" cookies={cookies}>
      <Flex alignItems="center" justify="center" height="full">
        <Heading
          as="h2"
          width="80%"
          color="red"
          textAlign="center"
          wordBreak="break-word"
        >
          [ErrorBoundary]: There was an error1: {error.message}
        </Heading>
      </Flex>
    </Document>
  );
}

export default ErrorBoundary;
