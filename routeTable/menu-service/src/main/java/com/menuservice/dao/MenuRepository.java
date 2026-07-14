package com.menuservice.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.menuservice.bean.Menu;

@Repository
public interface MenuRepository extends CrudRepository<Menu, Integer> {

}
