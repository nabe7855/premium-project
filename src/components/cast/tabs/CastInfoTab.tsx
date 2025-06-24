import React from "react";
import { CastSummary } from "@/types/cast";

interface Props {
  cast: CastSummary;
}

const CastInfoTab: React.FC<Props> = ({ cast }) => {
  return (
    <div>
      <p>名前: {cast.name}</p>
      <p>キャッチコピー: {cast.catchCopy}</p>
    </div>
  );
};

export default CastInfoTab;
