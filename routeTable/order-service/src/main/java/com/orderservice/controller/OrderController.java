package com.orderservice.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.orderservice.bean.Orders;
import com.orderservice.service.OrderService;

@RestController
@RequestMapping("/order")
@CrossOrigin
public class OrderController {

    @Autowired
    private OrderService service;

    @PostMapping("/create")
    public Orders create(@RequestBody Orders order) {
        return service.createOrder(order);
    }

    @PutMapping("/paid/{id}")
    public Orders paid(@PathVariable int id,
                      @RequestParam String paymentId) {
        return service.markPaid(id, paymentId);
    }
    @GetMapping("/hotel/{hotelId}")
    public List<Orders> getOrdersByHotel(@PathVariable int hotelId) {
        return service.findByHotelId(hotelId);
    }
    @GetMapping("/user/{userId}")
    public List<Orders> getOrdersByUser(@PathVariable int userId) {
        return service.findByUserId(userId);
    }
    @GetMapping("/earnings/{hotelId}")
    public List<Map<String, Object>> getEarnings(@PathVariable int hotelId) {
        return service.getDailyEarnings(hotelId);
    }
    @PutMapping("/cancel/{id}")
    public String cancelOrder(@PathVariable int id) {
        service.cancelOrder(id);
        return "CANCELLED";
    }
    
    @PutMapping("/refund/{id}")
    public boolean refundupdateStatus(
            @PathVariable int id
            
    ) {
      	
         service.refundupdateStatus(id);
         return true;
    }
}