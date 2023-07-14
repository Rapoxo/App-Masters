import type IconType from "@/@types/IconType";
import { Browsers, WindowsLogo } from "phosphor-react";
import React from "react";

type PlatformIcon = { [key in Platform]: IconType };

const Icons: PlatformIcon = {
  "PC (Windows)": WindowsLogo,
  "Web Browser": Browsers,
};

type PlatformIconProps = {
  platform: Platform;
};

const PlatformIcon = ({ platform }: PlatformIconProps) => {
  return (
    <span title={platform}>
      {React.createElement(Icons[platform], { weight: "fill" })}
    </span>
  );
};

export default PlatformIcon;
