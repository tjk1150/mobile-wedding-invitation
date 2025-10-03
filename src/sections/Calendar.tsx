'use client';

import React from 'react';

export default function Calendar(): React.ReactElement {
  return (
    <section className='calendar'>
      <h2 className='title en'>2월</h2>
      <div className='calendar-content'>
        <img
          className='week-col'
          src='/assets/calendar/calendar-sunday.svg'
          alt='sunday column'
        />
        <img
          className='week-col'
          src='/assets/calendar/calendar-monday.svg'
          alt='monday column'
        />
        <img
          className='week-col'
          src='/assets/calendar/calendar-tuesday.svg'
          alt='tuesday column'
        />
        <img
          className='week-col'
          src='/assets/calendar/calendar-wednesday.svg'
          alt='wednesday column'
        />
        <img
          className='week-col'
          src='/assets/calendar/calendar-thursday.svg'
          alt='thursday column'
        />
        <img
          className='week-col'
          src='/assets/calendar/calendar-friday.svg'
          alt='friday column'
        />
        <img
          className='week-col'
          src='/assets/calendar/calendar-saturday.svg'
          alt='saturday column'
        />
      </div>
      <img
        className='calendar-deco'
        src='/assets/calendar-deco.svg'
        alt='calendar deco'
      />
    </section>
  );
}
