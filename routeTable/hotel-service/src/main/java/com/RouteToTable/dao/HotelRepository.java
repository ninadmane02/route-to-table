package com.RouteToTable.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.RouteToTable.bean.Hotel;

@Repository
public interface HotelRepository extends CrudRepository<Hotel, Integer>{

}
