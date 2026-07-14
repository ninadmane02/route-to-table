package com.bookingservice.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bookingservice.bean.Booking;


@Repository
public interface BookingRepository extends CrudRepository<Booking, Integer> {

}
