package com.bookingservice.controller;




import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.bookingservice.bean.Booking;
import com.bookingservice.service.BookingService;

import java.util.List;

@RestController
@RequestMapping("/booking")
@CrossOrigin
public class BookingController { 

	@Autowired
    BookingService service;

    
//	@PostMapping("/check-availability")
//	public boolean checkAvailability(Booking b) 
	
	
 
    @PostMapping("/create")
    public Booking create(@RequestBody Booking booking) {
    	
    	
    	
        return service.createBooking(booking);
    }
    
    
    @PutMapping("cancel/{id}")
  public Booking updateStatus(
          @PathVariable int id
          
  ) {
    	
      return service.updateStatus(id);
  }
    
    @PutMapping("pending/{id}")
    public boolean pendingupdateStatus(
            @PathVariable int id
            
    ) {
      	
         service.pendingupdateStatus(id);
         return true;
    }
    
    @PostMapping("/from-waitlist")
    public boolean createFromWaitlist(@RequestBody Booking booking) {
        booking.setStatus("PENDING");
        booking.setType("table");
         
  service.createFromWaitlist(booking);
  return true;
    }
    
    

    @GetMapping("/hotel/{hotelId}")
    public List<Booking> hotelBookings(@PathVariable int hotelId) {
        return service.getHotelBookings(hotelId);
    }
    
    @PutMapping("/refund/{id}")
    public boolean refundupdateStatus(
            @PathVariable int id
            
    ) {
      	
         service.refundupdateStatus(id);
         return true;
    }
    
    
    
    
// 
//    @GetMapping("/user/{userId}")
//    public List<Booking> userBookings(@PathVariable int userId) {
//        return service.getUserBookings(userId);
//    }
//
//    @DeleteMapping("/cancel/{id}")
//    public String cancel(@PathVariable int id) {
//        service.cancelBooking(id);
//        return "Cancelled";
//    }
//    
//    
    @PutMapping("/confirm/{id}")
    public Booking confirm(@PathVariable int id) {
        return service.confirmBooking(id);
    }
}
