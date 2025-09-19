"use client";

import {
  addDays,
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";

import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import { useReservation } from "./ReservationContext";

function isAlreadyBooked(range, datesArr) {
  if (!range?.from || !range?.to) return false;

  return (
    range.from &&
    range.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from, end: range.to })
    )
  );
}

function DateSelector({ settings, cabin, bookedDates }) {
  //const defaultClassNames = getDefaultClassNames();
  const { range, setRange, resetRange } = useReservation();

  const displayRange = isAlreadyBooked(range, bookedDates) ? {} : range ?? {};

  const { regularPrice, discount } = cabin;
  const numNights =
    displayRange.from && displayRange.to
      ? differenceInDays(displayRange.to, displayRange.from)
      : 0;

  const cabinPrice = numNights > 0 ? numNights * (regularPrice - discount) : 0;

  // SETTINGS
  const { minBookingLength, maxBookingLength } = settings;

  function disableNotValidDates(curDate) {
    // минулі дні
    if (isPast(curDate)) return true;

    // вже заброньовані дні
    if (bookedDates.some((date) => isSameDay(date, curDate))) return true;

    // якщо користувач вибрав початок, застосовуємо min/max обмеження
    if (range?.from && !range?.to) {
      const minEndDate = addDays(range.from, minBookingLength + 1);
      const maxEndDate = addDays(range.from, maxBookingLength);

      // блокувати дні між start і мінімумом
      if (curDate > range.from && curDate < minEndDate) return true;

      // блокувати дні пізніше максимуму
      if (curDate > maxEndDate) return true;
    }

    return false;
  }

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        onSelect={(selectedRange) => {
          if (isAlreadyBooked(selectedRange, bookedDates)) return;
          setRange(selectedRange);
        }}
        selected={displayRange}
        min={minBookingLength + 1}
        max={maxBookingLength}
        //startMonth={new Date()}
        //hidden={{ before: new Date() }}
        //endMonth={}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        hideNavigation={true}
        disabled={disableNotValidDates}
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range?.from || range?.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
