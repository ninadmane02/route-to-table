package com.orderservice.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.orderservice.bean.Orders;
import com.orderservice.dao.OrderRepository;

@Service
public class OrderService {

    @Autowired
     OrderRepository repo;

    public Orders createOrder(Orders order) {
     
        return repo.save(order);
    }

    public Orders markPaid(int orderId, String paymentId) {
        Orders order = repo.findById(orderId).orElseThrow();

        order.setStatus("PAID");
        order.setRazorpayPaymentId(paymentId);

        return repo.save(order);
    }

	public List<Orders> findByHotelId(int hotelId) {
		
		

		List<Orders> result = new ArrayList();

		for (Orders o : repo.findAll()) {
		   if(o.getHotelId()==hotelId) {
			   result.add(o);
		   }
			
		}
		return result;
	}
	
	public List<Map<String, Object>> getDailyEarnings(int hotelId) {

	    List<Orders> orders = new ArrayList<>();
	    
	    for(Orders o:repo.findAll()) {
	    	if(o.getHotelId()==hotelId) {
	    		orders.add(o);
	    	}
	    }

	    Map<String, Double> map = new LinkedHashMap<>();

	    for (Orders o : orders) {

	        String date = o.getCreatedAt()
	                .toLocalDate()
	                .toString();

	        double amount = o.getAmount() != 0 ? o.getAmount() : 0;

	        map.put(date, map.getOrDefault(date, 0.0) + amount);
	    }

	    List<Map<String, Object>> result = new ArrayList<>();

	    for (Map.Entry<String, Double> entry : map.entrySet()) {
	        Map<String, Object> obj = new HashMap<>();
	        obj.put("day", entry.getKey());
	        obj.put("earnings", entry.getValue());
	        result.add(obj);
	    }

	    return result;
	}

	public List<Orders> findByUserId(int userId) {
		// TODO Auto-generated method stub
		List<Orders> result = new ArrayList();

		for (Orders o : repo.findAll()) {
		   if(o.getUserId()==userId) {
			   result.add(o);
		   }
			
		}
		return result;
	}
	public void cancelOrder(int id) {
	    Orders o = repo.findById(id).orElse(null);
	    if (o != null) {
	        o.setStatus("CANCELLED");
	        repo.save(o);
	    }
	}

	public void refundupdateStatus(int id) {
		
		for(Orders o:repo.findAll()) {
			if(o.getBookingId()==id) {
				o.setStatus("REFUNDED");
				repo.save(o);
				break;
				
			}
		}
	}
}
