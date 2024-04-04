"use client";
import React, { useState } from "react";
import DateRangePicker from "@/components/DatePicker";

const Home: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<Date[]>([]);
  const [weekendDates, setWeekendDates] = useState<Date[]>([]);

  const predefinedRanges = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
  ];

  const handleSelectRange = (dateRange: Date[], weekends: Date[]) => {
    setSelectedRange(dateRange);
    setWeekendDates(weekends);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen">
      <DateRangePicker
        onSelectRange={handleSelectRange}
        predefinedRanges={predefinedRanges}
      />
      {selectedRange.length > 0 && (
        <div className="flex flex-col items-center mt-4">
          <p>
            Selected Range: [{formatDate(selectedRange[0])},{" "}
            {formatDate(selectedRange[1])}]
          </p>
          <p>
            Weekend Dates: [
            {weekendDates.map((date) => formatDate(date)).join(", ")}]
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
