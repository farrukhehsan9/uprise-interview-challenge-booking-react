import React, { useState, useEffect } from "react";
import { DayPickerSingleDateController } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import "react-dates/initialize";
import moment from "moment";
import { Button } from "@uprise/button";
import {BASE_URL} from '../../config';

//Local en
import en from '../../locales/en.json';

const momentTz = require("moment-timezone");

const useTimes = (daySel) => {
  const [allSlots, setallSlots] = useState([]);
  const [bookings, setAllBooking] = useState([]);
  useEffect(() => {
    // server request for getting data
    fetch(`${BASE_URL}/createEvent/get`)
      .then((response) => response.json())
      .then((data) => {
        const newtimes = data;
        setallSlots(newtimes.filter((val) => val.id !== "Dr"));
        setAllBooking(
          newtimes.filter((val) => val.id !== "Dr").map((val) => val.bookings)
        );
      });
  }, []);

  return { allSlots, bookings };
};

const ShowAllEvents = () => {
  // show all events
  const [active, setActive] = useState(false);
  const [todayDate, setTodayDate] = useState(moment());
  const [focused, setfocused] = useState(false);
  const { allSlots } = useTimes(todayDate.format("YYYY-MM-DD"));

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
        <div className="m-3 p-3 mx-auto w-50 bg-white card">
          <div className="row">
            <div className="m-auto">
              {active ? (
                <>
                  <p className="text-center headng">
                    {en["Here are all the events on"]} {todayDate.format("YYYY-MMM-DD")}
                  </p>
                  {allSlots.filter(
                    (val) => val.date === todayDate.format("YYYY-MM-DD")
                  ).length ? (
                    allSlots
                      .filter(
                        (val) => val.date === todayDate.format("YYYY-MM-DD")
                      )
                      .map((val, i) => {
                        if (val.timezone !== "US/Eastern") {
                          let asd = val["e"].split("-");
                          let newasd = asd
                            .map((vals) => {
                              let qwe = momentTz.tz(
                                vals,
                                "hh:mm:ss A",
                                "US/Eastern"
                              );
                              let newQwe = qwe.clone().tz(val.timezone);
                              let st = newQwe.format("hh:mm:ss A");
                              return st;
                            })
                            .join(" - ");
                          return (
                            <p
                              key={i}
                              className="time-slots px-3 py-1 text-center"
                            >
                              {newasd} {val.timezone}
                            </p>
                          );
                        } else
                          return (
                            <p
                              key={i}
                              className="time-slots px-3 py-1 text-center"
                            >
                              {val.e} {val.timezone}
                            </p>
                          );
                      })
                  ) : (
                    <p className="text-center">{en["No events!"]}</p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-center headng">
                    {en["Here are all the events on"]}{" "}
                  </p>

                  <DayPickerSingleDateController
                    onDateChange={onDateChange}
                    onFocusChange={onFocusChange}
                    focused={focused}
                    date={todayDate}
                    numberOfMonths={1}
                  />
                  <Button
                    className="w-100 mt-2"
                    title="Show events"
                    onClick={() => setActive(true)}
                  ></Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx="true">
        {`
          .wall-color {
            background-color: #f8f8ff;
            height: 100vh;
          }
          .time-slots {
            background-color: #fff3e3;
            border-radius: 3px;
            font-size: 1vw;
            margin-bottom: 8px;
          }
          .btn-clr {
            background-color: #7d60ff;
            border-radius: 8px;
          }
          .headng {
            font-weight: 500;
          }
        `}
      </style>
    </div>
  );
};

export default ShowAllEvents;
