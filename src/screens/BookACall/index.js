import React, { useState } from "react";
import AvailableSlots from "./AvailableSlots";
import Img1 from "../../assets/images/success.PNG";
import { DayPickerSingleDateController } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import "./react_dates_overrides.css";
import "react-dates/initialize";
import moment from "moment";

import { Bold } from "@uprise/text";
import { Button } from "@uprise/button";

import en from "../../locales/en.json";

const BookACall = () => {
  const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [successful, setSuccessful] = useState(false);
  const [timezone, setTimezone] = useState("US/Eastern");
  const [duration, setDuration] = useState(0.5);

  const [focused, setfocused] = useState(false);
  const [todayDate, setTodayDate] = useState(moment());

  const handleTimezone = (e) => {
    setTimezone(e);
  };

  const onDateChange = (date) => {
    setTodayDate(date);
  };

  const onFocusChange = () => {
    // Force the focused states to always be truthy so that date is always selectable
    setfocused(true);
  };

  return (
    <div className="wall-color">
      <div className="row w-100">
        <div className="m-3 py-3 px-5 mx-auto w-75 bg-white card">
          {" "}
          {successful ? (
            <div className="row m-4">
              {" "}
              {/* Success message  */}{" "}
              <div className="m-auto w-50 text-center">
                <img alt="Img1" src={Img1} className="w-100" />
                <Bold>
                  <text> {en["Booking successful!"]} </text>{" "}
                </Bold>{" "}
              </div>{" "}
            </div>
          ) : active ? (
            <AvailableSlots
              timezone={timezone}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              daySel={todayDate.format("YYYY-MM-DD")}
              duration={duration}
              setSuccessful={setSuccessful}
            />
          ) : (
            <div className="row">
              <div className="col-sm">
                <p className="headng"> {en["Select a Date"]} </p>{" "}
                {" "}
                <DayPickerSingleDateController
                  onDateChange={onDateChange}
                  onFocusChange={onFocusChange}
                  focused={focused}
                  date={todayDate}
                  numberOfMonths={1}
                />{" "}
              </div>{" "}
              <div className="col-sm">
                <p className="headng"> {en["Select your timezone"]} </p>{" "}
                <div className="form-group drowCustom">
                  {" "}
                  {/* select timezone  */}{" "}
                  <select
                    className="form-control"
                    style={{
                      border: "none",
                      borderBottom: "1px solid #ced4da",
                    }}
                    value={timezone}
                    onChange={(e) => handleTimezone(e.target.value)}
                  >
                    {[
                      {
                        value: "US/Eastern",
                        label: " US / Eastern ",
                      },
                      {
                        value: "America/Chicago",
                        label: " Chicago ",
                      },
                      {
                        value: "America/Denver",
                        label: " Denver ",
                      },
                      {
                        value: "Europe/Berlin",
                        label: " Berlin ",
                      },
                      {
                        value: "America/Sao_Paulo",
                        label: " São Paulo ",
                      },
                      {
                        value: "Europe/Busingen",
                        label: " Busingen ",
                      },
                      {
                        value: "America/Fortaleza",
                        label: " Fortaleza ",
                      },
                      {
                        value: "Europe/London",
                        label: " London ",
                      },
                      {
                        value: "Asia/Dubai",
                        label: " Dubai ",
                      },
                    ].map(({ value, label }) => (
                      <option value={value}>{label}</option>
                    ))}
                  </select>{" "}
                </div>{" "}
                <p className="headng"> {en["Select call duration"]} </p>{" "}
                <div className="form-group ">
                  <select
                    className="form-control"
                    style={{
                      border: "none",
                      borderBottom: "1px solid #ced4da",
                    }}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    {[
                      "30 Minutes",
                      // , "60 Minutes"
                    ].map((val, i) => (
                      <option value={!i ? 0.5 : 1} key={i}>
                        {" "}
                        {val}{" "}
                      </option>
                    ))}{" "}
                  </select>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          )}{" "}
          {!active && (
            <Button
              title="Get Free Slots"
              className="w-100 mt-2"
              onClick={() => setActive(true)}
            ></Button>
          )}{" "}
        </div>{" "}
      </div>{" "}
      <style jsx="true">
        {" "}
        {`
          .form-control:focus {
            box-shadow: none !important;
          }
          .wall-color {
            background-color: #f8f8ff;
            height: 100vh;
          }
          .btn-clr {
            background-color: #7d60ff;
          }
          .headng {
            font-weight: 500;
          }
        `}{" "}
      </style>{" "}
    </div>
  );
};
export default BookACall;
