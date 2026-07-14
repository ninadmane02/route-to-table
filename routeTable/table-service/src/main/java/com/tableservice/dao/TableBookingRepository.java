package com.tableservice.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.tableservice.bean.TableBooking;

@Repository
public interface TableBookingRepository extends CrudRepository<TableBooking, Integer> {

}
