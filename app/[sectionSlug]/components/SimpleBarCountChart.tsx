import { DAYS, twentyFourHourToAMPMHour } from "@/date/display";
import { getTextBgColor } from "@/style/colors";
import { DayHour } from "@/types";
import { round, roundToWhole } from "@/utils/numbers";
import {
  getAveragePercent,
  getFilteredRecords,
  groupRecordsByDate,
} from "@/utils/records";
import { record } from "@prisma/client";
import clsx from "clsx";
import { format } from "date-fns";

interface SimpleBarCountChartProps {
  records: record[];
  selectedDayHour: DayHour;
}

export const SimpleBarCountChartProps = ({
  records,
  selectedDayHour,
}: SimpleBarCountChartProps) => {
  const filteredRecords = getFilteredRecords({ records, ...selectedDayHour });
  console.log({ filteredRecords });
  const groups = groupRecordsByDate(filteredRecords);
  console.log({ groups });
  const averagePercentFull = getAveragePercent({
    records,
    ...selectedDayHour,
  });

  return (
    <div>
      <div className="font-bold">
        {DAYS[selectedDayHour.day].name},{" "}
        {twentyFourHourToAMPMHour(selectedDayHour.hour)}
      </div>
      <div className="mt-2">
        <SimpleBar
          percent={averagePercentFull}
          innerText={`Usually ${roundToWhole(averagePercentFull)}% full`}
        />
      </div>

      <div className="mt-5 space-y-2">
        {groups.map((group) => {
          const average =
            group.records.reduce((acc, curr) => acc + curr.percent, 0) /
            group.records.length;
          const dateDisplay = format(new Date(group.dateString), `MMM d`);
          return (
            <div key={group.dateString}>
              <SimpleBar
                percent={average}
                innerText={`${dateDisplay} at ${twentyFourHourToAMPMHour(
                  selectedDayHour.hour
                )}, ${roundToWhole(average)}% full`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface SimpleBarProps {
  percent: number;
  innerText?: string;
}
const SimpleBar = ({ percent, innerText }: SimpleBarProps) => {
  return (
    <div className="w-full rounded-md h-7 bg-gray-100 relative">
      <div
        style={{ width: `${Math.min(percent, 100)}%` }}
        className={clsx(getTextBgColor(percent), "rounded-md h-full overflow-hidden")}
      ></div>
      <div className="absolute top-1/2 -translate-y-1/2 right-2 z-100 text-xs font-semibold text-gray-600">
        {innerText}
      </div>
    </div>
  );
};
