"use client";

import React from "react";

export default function Calendar(): React.ReactElement {
  return (
    <section className="calendar">
      <hgroup>
        <h2 className="title en" data-aos="fade-up">
          2026.02.28
        </h2>
        <p data-aos="fade-up">토요일 오후 2시 30분</p>
      </hgroup>
      <div className="calendar-content" data-aos="fade-up">
        <img
          className="week-col"
          src="/assets/calendar/calendar-sunday.svg"
          alt="sunday column"
        />
        <img
          className="week-col"
          src="/assets/calendar/calendar-monday.svg"
          alt="monday column"
        />
        <img
          className="week-col"
          src="/assets/calendar/calendar-tuesday.svg"
          alt="tuesday column"
        />
        <img
          className="week-col"
          src="/assets/calendar/calendar-wednesday.svg"
          alt="wednesday column"
        />
        <img
          className="week-col"
          src="/assets/calendar/calendar-thursday.svg"
          alt="thursday column"
        />
        <img
          className="week-col"
          src="/assets/calendar/calendar-friday.svg"
          alt="friday column"
        />
        <img
          className="week-col"
          src="/assets/calendar/calendar-saturday.svg"
          alt="saturday column"
        />
      </div>
    </section>
  );
}
