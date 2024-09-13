import { DatePicker } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";

export default function DatePickerExample() {
  const [{ month, year }, setDate] = useState({ month: 1, year: 2018 });
  const [selectedDates, setSelectedDates] = useState({
    start: new Date("Wed Feb 07 2018 00:00:00 GMT-0500 (EST)"),
    end: new Date("Mon Mar 12 2018 00:00:00 GMT-0500 (EST)"),
  });

  // useEffect(() => {
  //   console.log(selectedDates);
  // }, [selectedDates]);

  const handleMonthChange = useCallback(
    (month: number, year: number) => setDate({ month, year }),
    [],
  );

  return (
    <DatePicker
      month={month}
      year={year}
      onChange={setSelectedDates}
      onMonthChange={handleMonthChange}
      selected={selectedDates}
      multiMonth
      allowRange
    />
  );
}
