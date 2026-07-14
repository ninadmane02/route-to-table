package com.tableservice.service;


import com.tableservice.controller.TableController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.tableservice.bean.Booking;
import com.tableservice.bean.RestaurantTable;
import com.tableservice.bean.Slot;
import com.tableservice.bean.TableBooking;
import com.tableservice.bean.Waitlist;
import com.tableservice.dao.SlotRepository;
import com.tableservice.dao.TableBookingRepository;
import com.tableservice.dao.TableRepository;
import com.tableservice.dao.WaitlistRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
public class TableService {
	
	@Autowired
	 SlotRepository slotRepository;
	@Autowired

  TableRepository tableRepo;
	@Autowired
    TableBookingRepository bookingRepo;
	
	@Autowired
     WaitlistRepository waitlistRepo;

	@Autowired
	RestTemplate restTemplate;
	

	
   

  public Map<String, Object> assignTable(Booking booking) {

    Map<String, Object> res = new HashMap<>();

  
    System.out.println("HotelId: " + booking.getHotelId());
    System.out.println("Persons: " + booking.getPersons());
    System.out.println("SlotId: " + booking.getSlotId());
    System.out.println("BookingDate: " + booking.getBookingDate());
   
    List<RestaurantTable> tables = new ArrayList<>();
    List<RestaurantTable> allTables = (List<RestaurantTable>) tableRepo.findAll();

   
    for (RestaurantTable t : allTables) {
        if (Objects.equals(t.getHotelId(), booking.getHotelId())) {
            tables.add(t);
        }
    }

    System.out.println("Total tables for hotel: " + tables.size());

    List<TableBooking> bookedTables = new ArrayList<>();
    List<TableBooking> allBookings = (List<TableBooking>) bookingRepo.findAll();

 
    for (TableBooking b : allBookings) {

        boolean sameHotel =
                Objects.equals(b.getHotelId(), booking.getHotelId());

        boolean sameSlot =
                Objects.equals(b.getSlotId(), booking.getSlotId());

        boolean sameDate =
                b.getBookingDate() != null
                        && booking.getBookingDate() != null
                        && b.getBookingDate().equals(booking.getBookingDate());

        if (sameHotel && sameSlot && sameDate) {
            bookedTables.add(b);
        }
    }

    System.out.println("Booked tables found: " + bookedTables.size());

    for (RestaurantTable table : tables) {

        System.out.println("Checking tableId: " + table.getId());

        if (table.getCapacity() < booking.getPersons()) {
            System.out.println("Rejected (capacity)");
            continue;
        }

        boolean isBooked = false;

        for (TableBooking booked : bookedTables) {

            System.out.println("Comparing -> bookedTableId: " 
                + booked.getTableId() + " | currentTableId: " + table.getId());

            if (Objects.equals(booked.getTableId(), table.getId())) {
                
                isBooked = true;
                break;
            }
        }

        System.out.println("FINAL isBooked = " + isBooked);

        if (!isBooked) {

            System.out.println("FOUND AVAILABLE TABLE: " + table.getId());

            res.put("success", true);
            res.put("tableId", table.getId());
            res.put("slotId", booking.getSlotId());
            res.put("message", "Table assigned successfully");

            return res;
        }
    }

    

    res.put("success", false);
    res.put("slotId", booking.getSlotId());
    res.put("message", "No table available (waitlist)");

    return res;
}
  public void tableConfirm(Booking booking) {
	  
	  	  TableBooking tb = new TableBooking();
	      tb.setTableId(booking.getTableId());
	      tb.setBookingId(booking.getId());
	      tb.setBookingDate(booking.getBookingDate());
	      tb.setSlotId(booking.getSlotId());
	      tb.setHotelId(booking.getHotelId());
	  
	      bookingRepo.save(tb);
	   }
  
  
   public Waitlist addwaitlist(Waitlist waitlist) {
		
		return waitlistRepo.save(waitlist);
	 }
  
   
   public void releaseTable(int bookingId) {
	   
	   for (TableBooking tb : bookingRepo.findAll()) {
	        if (tb.getBookingId() == bookingId) {
	           bookingRepo.deleteById(tb.getId());
	           assignToWaitlist(tb.getHotelId(),tb.getTableId(),tb.getBookingDate(),tb.getSlotId(),tb.getBookingId());
	            break;
	        }
	    }
   
   }
   
   
   public void assignToWaitlist(int hotelId, int tableId,LocalDate bookingDate,int slotId,int bookingId) {

	  

	    for(Waitlist w1:waitlistRepo.findAll()) {
	    	if(w1.getHotelId()==hotelId && w1.getBookingDate().equals(bookingDate) && w1.getSlotId()==slotId) {
	    		
	    		
	    		
	    		
	    		Booking booking = new Booking();

	    		booking.setUserId(w1.getUserId()); 
	    		booking.setHotelId(w1.getHotelId());
	    		booking.setBookingDate(w1.getBookingDate());
	    		booking.setBookingTime(w1.getBookingTime());
	    		booking.setSlotId(w1.getSlotId());
	    		booking.setPersons(w1.getPersons());
	    		booking.setTableId(tableId);
	    		
	    		 Boolean assigned = restTemplate.postForObject(
	    		            "http://booking-service/booking/from-waitlist",
	    		            booking,
	    		            Boolean.class
	    		    );
	    		 
	    		 
	    		
	    		waitlistRepo.deleteById(w1.getId());
	    		break;
	    	}
	    }
	   
	    
	}
  
// 
//
//    TableBooking target = null;
//
//  
//    for (TableBooking tb : bookingRepo.findAll()) {
//        if (tb.getBookingId() == bookingId) {
//            target = tb;
//            break;
//        }
//    }
//
//    if (target == null) return;
//
//    bookingRepo.delete(target);
//
//    List<Waitlist> allWaitlist = (List<Waitlist>) waitlistRepo.findAll();
//
//    List<Waitlist> filtered = new ArrayList<>();
//
//    
//    for (Waitlist w : allWaitlist) {
//        if (w.getHotelId()==target.getHotelId()
//                && w.getBookingDate().equals(target.getBookingDate())
//                && w.getSlotId().equals(target.getSlotId())
//                && w.getStatus().equals("WAITING")) {
//
//            filtered.add(w);
//        }
//    }
//
//    for (Waitlist w : filtered) {
//
//        Booking b = new Booking();
//        b.setId(w.getBookingId());
//        b.setHotelId(w.getHotelId());
//        b.setPersons(w.getPersons());
//        b.setBookingDate(w.getBookingDate());
//        b.setSlotId(w.getSlotId());
//
////        boolean assigned = assignTable(b);
////
////        if (assigned) {
////            w.setStatus("ALLOCATED");
////            waitlistRepo.save(w);
////            break;
////        }
//    }
//}
// 
// 
 public RestaurantTable addTable(RestaurantTable table) {
     table.setStatus("AVAILABLE");
     return tableRepo.save(table);
 }
//
 public List<RestaurantTable> getTablesByHotel(int hotelId) {

     List<RestaurantTable> list = new ArrayList<>();

     for (RestaurantTable t : tableRepo.findAll()) {
    	
         if (t.getHotelId()==hotelId) {
             list.add(t);
         }
     }

     return list;
 }
//
//
 public void deleteTable(int id) {
     tableRepo.deleteById(id);
 }
//
// 
// public RestaurantTable updateStatus(int id, String status) {
//
//     RestaurantTable t = tableRepo.findById(id).orElse(null);
//
//     if (t == null) return null;
//
//     t.setStatus(status);
//     return tableRepo.save(t);
// }
//
// public int getSlotId(String time) {
//
//	    if (time == null) {
//	        throw new RuntimeException("Booking time is required");
//	    }
//
//	    LocalTime bookingTime = LocalTime.parse(time);
//
//	    for (Slot slot : slotRepository.findAll()) {
//
//	        if ((bookingTime.equals(slot.getStartTime()) || bookingTime.isAfter(slot.getStartTime()))
//	                && bookingTime.isBefore(slot.getEndTime())) {
//
//	            return slot.getId();
//	        }
//	    }
//
//	    return 1; // fallback slot
//	}
//
// public List<Waitlist> findByBookingId(int bookingId) {
//	 List<Waitlist> list = new ArrayList<>();
//
//     for (Waitlist t : waitlistRepo.findAll()) {
//         if (t.getBookingId()==bookingId) {
//             list.add(t);
//         }
//     }
//
//     return list;
//	
// }
 public void deleteByWaitlistId(int id) {
	 waitlistRepo.deleteById(id);
 }
//
//
 public RestaurantTable updateData(int id, RestaurantTable table) {
	Optional<RestaurantTable> op=tableRepo.findById(id);
	RestaurantTable t=op.get();
	t.setCapacity(table.getCapacity());
	t.setStatus(table.getStatus());
	t.setTableNumber(table.getTableNumber());
	 tableRepo.save(t);
	return table;
 }
 public List<Waitlist> waitlist(int id) {
	
	 List<Waitlist> list=new ArrayList<>();
	 for(Waitlist w:waitlistRepo.findAll()) {
		 if(w.getUserId()==id) {
			 list.add(w);
		 }
	 }
	 return list;
	
 }

}
