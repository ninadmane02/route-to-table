package com.orderservice.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.orderservice.bean.Orders;


@Repository
public interface OrderRepository extends CrudRepository<Orders, Integer>{

}
