import React, { useState, useEffect } from "react";
import moment from "moment";
import {BASE_URL} from '../../config';

//Local en
import en from '../../locales/en.json';

const momentTz = require("moment-timezone");

const useTimes = (daySel, duration, e) => {
  const [times, settimes] = useState([]);
  const [allSlots, setallSlots] = useState([]);
  const [changingFormat, setchangingFormat] = useState([]);
  useEffect(() => {
    fetch(`${BASE_URL}/createEvent/get`)
      .then((response) => response.json())
      .then((data) => {
        const newtimes = data;
        if (!data.length) return;

        settimes(newtimes.find((val) => val.id === "Dr"));
        let st = newtimes.find((val) => val.id === "Dr")["Start Hours"];
        let end = newtimes.find((val) => val.id === "Dr")["End Hours"];
        let AMPM = end.slice(-2);
        let AMPM1 = st.slice(-2);

        if (AMPM === "PM") {
          end = +end.slice(0, -2) + 12;
        } else if (AMPM === "AM") {
          end = +end.slice(0, -2);
        }
        if (AMPM1 === "PM") {
          st = +st.slice(0, -2) + 12;
        } else if (AMPM1 === "AM") {
          st = +st.slice(0, -2);
        }

        setallSlots(timelineLabels(st, duration, "hours", end));
        setchangingFormat(
          changingFormatFun(
            timelineLabels(st, duration, "hours", end),
            newtimes.filter((val) => val.id !== "Dr"),
            daySel
          )
        );
      });
  }, [daySel, duration]);

  return { times, allSlots, changingFormat };
};

const timelineLabels = (desiredStartTime, interval, period, end, day) => {
  const periodsInADay = moment
    .duration(+end - +desiredStartTime, "hours")
    .as(period);

  const timeLabels = [];
  const startTimeMoment = moment(desiredStartTime, "hh:mm:ss");
  for (let i = 0; i <= periodsInADay; i += interval) {
    startTimeMoment.add(i === 0 ? 0 : interval, period);
    day
      ? timeLabels.push(`${day}T${startTimeMoment.format("hh:mm:ss A")}`)
      : timeLabels.push(`${startTimeMoment.format("hh:mm:ss A")}`);
  }

  return timeLabels;
};

const changingFormatFun = (allSlots, excl, daySel) => {
  let timeHere;
  let arrayHere = [];
  for (let i = 0; i < allSlots.length - 1; i++) {
    timeHere = `${allSlots[i]} - ${allSlots[i + 1]}`;
    arrayHere.push(timeHere);
  }

  let forDateEx = excl.filter((val) => val.date === daySel);

  let newArray = arrayHere.filter(
    (val, i) => !forDateEx.map((val) => val.e).includes(val)
  );

  return newArray;
};

const AvailableSlots = ({
  daySel,
  setSuccessful,
  duration,
  setIsLoading,
  isLoading,
  timezone,
}) => {
  const [selectSlot, setSlot] = useState("");

  const { changingFormat } = useTimes(daySel, duration, timezone);

  const handleOnChange = async (e, val, i) => {
    setSlot(e);
    let formatting = `${daySel}T${val.slice(0, 11)}`;
    setIsLoading(true);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        e: val,
        date: daySel,
        bookings: formatting,
        timezone: timezone,
      }),
    };

    // server request for adding data
    fetch(
      `${BASE_URL}/createEvent/add`,
      requestOptions
    ).then((res) => {});

    lastFormating().splice(i, 1);
    setSuccessful(true);
  };

  const lastFormating = () => {
    let arrayHere = [];
    let timeHere;
    let values = [...changingFormat, "5:00:00 PM"].map((val) => {
      let qwe = momentTz.tz(val, "hh:mm:ss A", "US/Eastern");
      let newQwe = qwe.clone().tz(timezone);
      return newQwe.format("hh:mm:ss A");
    });
    for (let i = 0; i < values.length; i++) {
      timeHere = `${values[i]} - ${values[i + 1]}`;
      arrayHere.push(timeHere);
    }

    return arrayHere;
  };

  return (
    <div className="p-4">
      <p className="mb-4 headng"> {en["Click on any of the time slots to book"]} </p>{" "}
      <div className="row">
        {" "}
        {/* Show Success message here */}{" "}
        {isLoading ? (
          <p> {en["Loading..."]} </p>
        ) : timezone === "US/Eastern" ? (
          changingFormat.map((val, i) => (
            <div key={i} className="col-sm-4 mb-4 p-0">
              <span
                className="slots px-3 py-2"
                onClick={(e) => handleOnChange(e.target.innerText, val, i)}
                style={{
                  background: selectSlot === val && "#7d60ff",
                  color: selectSlot === val && "white",
                }}
              >
                {val}{" "}
              </span>{" "}
            </div>
          ))
        ) : (
          changingFormat.map((val, i) => (
            <div key={i} className="col-sm-4 mb-4 p-0">
              <span
                className="slots px-3 py-2"
                onClick={(e) => handleOnChange(e.target.innerText, val, i)}
                style={{
                  background: selectSlot === val && "#7d60ff",
                  color: selectSlot === val && "white",
                }}
              >
                {lastFormating()[i]}{" "}
              </span>{" "}
            </div>
          ))
        )}{" "}
      </div>{" "}
      <style jsx="true">
        {" "}
        {`
          .headng {
            font-weight: 500;
          }
          .slots {
            background-color: #f8f8ff;
            border-radius: 8px;
            font-size: 1vw;
            margin-bottom: 8px;
            color: #a996ff;
            font-weight: 600;
          }
          .slots:hover {
            cursor: pointer;
          }
        `}{" "}
      </style>{" "}
    </div>
  );
};

export default AvailableSlots;
