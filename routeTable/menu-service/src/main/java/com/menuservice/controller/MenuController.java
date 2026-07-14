package com.menuservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.menuservice.bean.Menu;
import com.menuservice.service.MenuService;

@RestController
@RequestMapping("/menu")
@CrossOrigin("*")
public class MenuController {
	
	
	@Autowired
	MenuService ms;
	
	 @PostMapping("/add")
	    public Menu add(@RequestBody Menu m) {
		 
		     
	        return ms.addMenu(m);
	    }
	 @PutMapping("/update/{id}")
	 public Menu update(@RequestBody Menu m, @PathVariable int id) {
	     m.setId(id);
	     return ms.updateMenu(m);
	 }

	    @GetMapping("/{hotelId}")
	    public List<Menu> get(@PathVariable int hotelId) {
	    	
	        return ms.findByHotelId(hotelId);
	    }
	   

	    @DeleteMapping("/delete/{id}")
	    public void delete(@PathVariable int id) {
	        ms.deleteHotelById(id);
	    }
	
	
	
	
	
	

}
