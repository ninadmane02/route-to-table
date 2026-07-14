package com.tableservice.controller;




import com.tableservice.dao.SlotRepository;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tableservice.bean.Booking;
import com.tableservice.bean.RestaurantTable;
import com.tableservice.bean.TableBooking;
import com.tableservice.bean.Waitlist;
import com.tableservice.service.TableService;

@RestController
@RequestMapping("/table")
@CrossOrigin
public class TableController {
	
	
	@Autowired

   TableService tableService;



	

    

	@PostMapping("/check-availability")
	public ResponseEntity<Map<String, Object>> assignTable(
	        @RequestBody Booking booking) {

	    int slotId = getSlotId(booking.getBookingTime());
	    booking.setSlotId(slotId);

	    Map<String, Object> response = tableService.assignTable(booking);

	    if (Boolean.TRUE.equals(response.get("success"))) {
	        return ResponseEntity.ok(response);
	    }

	    return ResponseEntity.status(HttpStatus.OK) 
	            .body(response);
	}
	
	public int getSlotId(String time) {

	    int hour = Integer.parseInt(time.split(":")[0]);

	    if (hour >= 9 && hour < 12) return 1;
	    if (hour >= 12 && hour < 16) return 2;
	    if (hour >= 18 && hour < 20) return 3;
	    if (hour >= 20 && hour < 23) return 4;

	    return -1;
	}
	@PostMapping("/assign")

	public boolean assign(@RequestBody Booking t) {
		tableService.tableConfirm(t);
		return true;
		
	}
	
	
	@PostMapping("/waitlist/booking/add")
    public Waitlist getByBooking(@RequestBody Waitlist waitlist) {
        return tableService.addwaitlist(waitlist);
    }
    @DeleteMapping("/release/{bookingId}")
    public void release(@PathVariable int bookingId) {
    	System.out.println(bookingId);
        tableService.releaseTable(bookingId);
    }
//    
//
    @PostMapping("/add")
    public RestaurantTable addTable(@RequestBody RestaurantTable table) {
        return tableService.addTable(table);
    }
//
//
    @GetMapping("/{hotelId}")
    public List<RestaurantTable> getTables(@PathVariable int hotelId) {
        return tableService.getTablesByHotel(hotelId);
    }
//
    @DeleteMapping("/delete/{id}")
    public String deleteTable(@PathVariable int id) {
        tableService.deleteTable(id);
        return "Deleted";
    }
    
    @PutMapping("/update/{id}")
  public RestaurantTable updateData(
          @PathVariable int id,
          @RequestBody RestaurantTable table) {

      return tableService.updateData(id, table);
  }
    
    @GetMapping("/waitlist/user/{id}")
  public List<Waitlist> waitlist(@PathVariable int id) {
    	List<Waitlist> list=   tableService.waitlist(id);
		return list;
  }
//
//
//    @PutMapping("/status/{id}")
//    public RestaurantTable updateStatus(
//            @PathVariable int id,
//            @RequestParam String status) {
//
//        return service.updateStatus(id, status);
//    }
//    
    
//    
@DeleteMapping("/waitlist/delete/{id}")
    public void delete(@PathVariable int id) {
        tableService.deleteByWaitlistId(id);
    }
    
}
