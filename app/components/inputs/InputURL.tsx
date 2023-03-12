import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useState } from "react";

export const InputURL = () => {
  const [url, setUrl] = useState("");

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUrl(e.target.value);

  return (
    <FormControl isRequired>
      <FormLabel htmlFor="url">Enter a Media Url</FormLabel>
      <Input
        type="url"
        placeholder="Url must start with http:// or https://"
        id="url"
        name="url"
        value={url}
        onChange={handleUrlChange}
      />
      <FormHelperText>
        {`For example: https://example.com/path/to/segment-video-{{index}}.ts. You can use {{index}} as a placeholder for the segment index.`}
      </FormHelperText>
    </FormControl>
  );
};
