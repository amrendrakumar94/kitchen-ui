import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

export default function Reservation() {
  const [noOfguest, setNoOfGuest] = React.useState("");
  const [value, setValue] = React.useState(dayjs("2022-04-17T15:30"));

  const handleChange = (event) => {
    setNoOfGuest(event.target.value);
  };
  return (
    <>
      <div className="flex justify-center mt-36">
        <label>
          <b>Number of Guests</b>
        </label>
      </div>
      <div className="flex justify-center mt-4 w-full">
        <select
          className="border border-gray-300 rounded-3xl min-w-60  shadow text-center block  p-1.5 hover:bg-white"
          onChange={handleChange}
          value={noOfguest}
        >
          <option value={1} className={"bg-white hover:bg-slate-600"}>
            1
          </option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>
      <div className="flex flex-col justify-center mt-10">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div>
            <DateCalendar className="bg-purple-100 shadow rounded-2xl" />
          </div>
          <div className="flex justify-center mt-6">
            <DemoContainer components={["TimePicker", "TimePicker"]}>
              <TimePicker
                label="Time"
                value={value}
                onChange={(newValue) => setValue(newValue)}
              />
            </DemoContainer>
          </div>
        </LocalizationProvider>
      </div>
      <div className="flex justify-center mt-8">
        <button className="rounded-xl min-w-28 p-1 bg-purple-600 text-white">
          Confirm
        </button>
      </div>
    </>
  );
}
