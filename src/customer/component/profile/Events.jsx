import React from 'react';
import EventsCard from './EventsCard';

const Events = () => {
  return (
    <div className="mt-5 px-5">
      <h1 className="text-2xl font-bold text-[#2B2825] mb-6">Events & Offers</h1>
      <div className="flex flex-wrap gap-6 justify-start items-center">
        {[1, 2, 3].map((item, index) => (
          <EventsCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default Events;