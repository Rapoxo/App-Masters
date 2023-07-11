import { Browsers, WindowsLogo } from "phosphor-react";
import React from "react";

const icons = {
  "PC (Windows)": <WindowsLogo weight="fill" />,
  "Web Browser": <Browsers weight="fill" />,
};

type PlatformIconProps = {
  platform: Platform;
};

const PlatformIcon = ({ platform }: PlatformIconProps) => {
  return <span title={platform}>{icons[platform]}</span>;
};

export default PlatformIcon;
