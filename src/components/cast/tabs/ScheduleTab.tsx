import React from "react";
import { CastSummary } from "@/types/cast";

interface Props {
  cast: CastSummary;
}

const ScheduleTab: React.FC<Props> = ({ cast }) => (
  <div>出勤予定（仮）: {cast.name}</div>
);

export default ScheduleTab;
