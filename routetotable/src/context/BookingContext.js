import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    hotel: null,
    date: '',
    time: '',
    guests: 1,
    selectedItems: [],
    totalAmount: 0,
    status: 'idle' // idle, pending, confirmed, waiting
  });

  const updateBooking = (newData) => {
    setBookingData(prev => ({ ...prev, ...newData }));
  };

  const resetBooking = () => {
    setBookingData({
      hotel: null,
      date: '',
      time: '',
      guests: 1,
      selectedItems: [],
      totalAmount: 0,
      status: 'idle'
    });
  };

  return (
    <BookingContext.Provider value={{ bookingData, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
