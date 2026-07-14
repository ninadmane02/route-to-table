package com.menuservice.service;

import com.menuservice.controller.MenuController;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.menuservice.bean.Menu;
import com.menuservice.dao.MenuRepository;

@Service
public class MenuService {
	
	
	
	@Autowired
	MenuRepository mr;

	

	public Menu addMenu(Menu m) {
		
		return mr.save(m);
	}

	public List<Menu> findByHotelId(int hotelId) {
		
		List<Menu> list=new ArrayList<>();
		
		for(Menu m:mr.findAll()) {
			if(m.getHotelId()==hotelId) {
				list.add(m);
			}
		}
		return list;
	}

	public void deleteHotelById(int id) {
		
		mr.deleteById(id);
		
	}

	public Menu updateMenu(Menu m) {
		System.out.println(m.getImageUrl());
		
		
		
		return mr.save(m);
	}

}
