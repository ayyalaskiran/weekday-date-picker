import React, { useState } from 'react';

interface DateRangePickerProps {
  onSelectRange: (dateRange: Date[], weekends: Date[]) => void;
  predefinedRanges?: { label: string; days: number }[];
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onSelectRange, predefinedRanges = [] }) => {
  const [startMonth, setStartMonth] = useState<number>(new Date().getMonth());
  const [startYear, setStartYear] = useState<number>(new Date().getFullYear());
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSelectRange = (startDate: Date, endDate: Date) => {
    if (startDate && endDate) {
      const weekendDates = getWeekendDates(startDate, endDate);
      onSelectRange([startDate, endDate], weekendDates);
    }
  };

  const handleDateClick = (day: number, isNextMonth: boolean) => {
    const clickedDate = new Date(startYear, startMonth + (isNextMonth ? 1 : 0), day);
    
    if (clickedDate.getDay() !== 0 && clickedDate.getDay() !== 6) {
      if (!startDate || endDate) {
        setStartDate(clickedDate);
        setEndDate(null);
      } else if (clickedDate >= startDate) {
        setEndDate(new Date(clickedDate));
        handleSelectRange(startDate, new Date(clickedDate));
      } else {
        setEndDate(startDate);
        setStartDate(clickedDate);
      }
    }
  };
  
  

  const handlePrevMonth = () => {
    setStartMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    setStartYear((prevYear) => (startMonth === 0 ? prevYear - 1 : prevYear));
  };

  const handleNextMonth = () => {
    setStartMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setStartYear((prevYear) => (startMonth === 11 ? prevYear + 1 : prevYear));
  };

  const handlePrevYear = () => {
    setStartYear((prevYear) => prevYear - 1);
  };

  const handleNextYear = () => {
    setStartYear((prevYear) => prevYear + 1);
  };

  const isWeekend = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day);
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const getWeekendDates = (startDate: Date, endDate: Date) => {
    const weekendDates: Date[] = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (isWeekend(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear())) {
        weekendDates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return weekendDates;
  };

  const renderCalendar = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days: JSX.Element[] = [];
  
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="py-2"></div>);
    }
  
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected =
        (startDate && isInRange(year, month, i)) ||
        (endDate && isInRange(year, month, i)) ||
        (!startDate && !endDate && i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) ||
        (startDate && !endDate && i === startDate.getDate() && month === startDate.getMonth() && year === startDate.getFullYear());
  
      const handleClick = () => handleDateClick(i, month !== startMonth);
      const isWeekendDay = isWeekend(i, month, year);
      let highlightClass = isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-200';
      if (isWeekendDay && isSelected) {
        highlightClass = 'bg-blue-300 text-white';
      } else if (isWeekendDay) {
        highlightClass = 'text-gray-400';
      }
  
      days.push(
        <div
          key={`day-${i}`}
          className={`cursor-pointer py-2 text-center ${highlightClass}`}
          onClick={handleClick}
          style={{ cursor: isWeekendDay ? 'not-allowed' : 'pointer' }}
        >
          {i}
        </div>
      );
    }
    return days;
  };
  

  const isInRange = (year: number, month: number, day: number) => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const current = new Date(year, month, day);
    return current >= start && current <= end;
  };

  const handlePredefinedRange = (days: number) => {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() - 1);
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);
    const weekendDates = getWeekendDates(startDate, endDate);
    setStartDate(startDate);
    setEndDate(endDate);
    onSelectRange([startDate, endDate], weekendDates);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 gap-8 border border-blue-700 bg-white rounded-lg p-4 m-4">
        <div>
          <div className="flex mb-4 justify-start">
            <button onClick={handlePrevYear} className="mr-4" title="Prev Year">{"<<"}</button>
            <button onClick={handlePrevMonth} className="mr-4" title="Prev Month">{"<"}</button>
            <h2 className="font-bold">{`${new Date(startYear, startMonth).toLocaleString('default', {
              month: 'long',
            })} ${startYear}`}</h2>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center py-2 text-gray-500">
                {day}
              </div>
            ))}
            {renderCalendar(startYear, startMonth)}
          </div>
        </div>
        <div>
          <div className="flex mb-4 justify-end">
            <h2 className="font-bold">{`${new Date(startYear, startMonth + 1).toLocaleString('default', {
              month: 'long',
            })} ${startYear}`}</h2>
            <button onClick={handleNextMonth} className="ml-4" title="Next Month">{">"}</button>
            <button onClick={handleNextYear} className="ml-4" title="Next Year">{">>"}</button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center py-2 text-gray-500">
                {day}
              </div>
            ))}
            {renderCalendar(startYear, startMonth + 1)}
          </div>
        </div>
      </div>
      <div className="mt-8">
        {predefinedRanges.map((range, index) => (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded" key={index}  onClick={() => handlePredefinedRange(range.days)}>{range.label}</button>
        ))}
      </div>
    </div>
  );
};

export default DateRangePicker;
