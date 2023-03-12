import { VIDEO_FORMATS } from "@/constants/common";
import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import type { ChangeEvent, FC } from "react";
import { useState } from "react";

export const SelectFormat: FC = () => {
  const [format, setFormat] = useState("mp4");
  const handleFormatChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setFormat(e.target.value);

  return (
    <FormControl>
      <FormLabel htmlFor="format">Output Format</FormLabel>
      <Select
        placeholder="Select a format"
        value={format}
        onChange={handleFormatChange}
        id="format"
        name="format"
      >
        {VIDEO_FORMATS.map((format) => (
          <option key={format} value={format}>
            {format}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
