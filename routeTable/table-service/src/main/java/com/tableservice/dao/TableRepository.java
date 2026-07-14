package com.tableservice.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.tableservice.bean.RestaurantTable;

@Repository
public interface TableRepository extends CrudRepository<RestaurantTable, Integer>{
	
	

}
