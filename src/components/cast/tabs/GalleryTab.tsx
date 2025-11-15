import React from "react";
import { CastSummary } from "@/types/cast";

interface Props {
  cast: CastSummary;
}

const GalleryTab: React.FC<Props> = ({ cast }) => (
  <div>ギャラリー（仮）: {cast.name}</div>
);

export default GalleryTab;
