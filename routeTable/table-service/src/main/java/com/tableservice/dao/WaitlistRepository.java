package com.tableservice.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.tableservice.bean.Waitlist;

@Repository

public interface WaitlistRepository extends CrudRepository<Waitlist, Integer> {

}
