import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { FaChevronDown, FaDownload, FaVideo } from "react-icons/fa";
import { AiFillAudio } from "react-icons/ai";
import type { FC } from "react";

export interface DownloadOptionsProps {
  url: string;
  format: string;
}
export const DownloadOptions: FC<DownloadOptionsProps> = ({ url, format }) => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        colorScheme="blue"
        variant="outline"
        rightIcon={<FaChevronDown />}
        isDisabled={!url}
        size="sm"
      >
        Download
      </MenuButton>
      <MenuList>
        <MenuItem
          icon={<FaDownload />}
          as={"a"}
          href={`${url}?format=${format}&download`}
          download
        >
          Save as Video
        </MenuItem>
        <MenuItem
          icon={<FaVideo />}
          as={"a"}
          href={`${url}?type=video&format=${format}&download`}
          download
        >
          Video Only
        </MenuItem>
        <MenuItem
          icon={<AiFillAudio />}
          as={"a"}
          href={`${url}?type=audio&format=${format}&download`}
          download
        >
          Audio Only
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
