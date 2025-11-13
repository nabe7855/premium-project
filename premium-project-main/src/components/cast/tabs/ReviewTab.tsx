import React from "react";
import { CastSummary } from "@/types/cast";

interface Props {
  cast: CastSummary;
}

const ReviewTab: React.FC<Props> = ({ cast }) => (
  <div>口コミタブ：{cast.name} に関する口コミ</div>
);

export default ReviewTab;
