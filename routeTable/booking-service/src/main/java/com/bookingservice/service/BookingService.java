package com.bookingservice.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.bookingservice.bean.Booking;
import com.bookingservice.dao.BookingRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class BookingService {
	
	@Autowired
	BookingRepository br;
	
	@Autowired
	RestTemplate restTemplate;
	
	
	

	public Booking createBooking(Booking booking) {

	    booking.setStatus("PENDING");

	    
	    
	    return br.save(booking);
	}
	public Booking confirmBooking(int bookingId) {

	    Booking booking = br.findById(bookingId)
	            .orElseThrow(() -> new RuntimeException("Booking not found"));

	   
	    Boolean assigned = restTemplate.postForObject(
	            "http://table-service/table/assign",
	            booking,
	            Boolean.class
	    );

	    if (assigned != null && assigned) {
	        booking.setStatus("CONFIRMED");
	    } else {
	        booking.setStatus("WAITLISTED");
	    }

	    return br.save(booking);
	}
	
	
	
	public Booking updateStatus(int id) {
		
			   Optional<Booking> op=br.findById(id);
			   Booking b=op.get();
		
			    b.setStatus("CANCELLED");
			    return br.save(b);
		}
	@Autowired
	JavaMailSender javaMailSender;
	
	public Booking pendingupdateStatus(int id) {
		
		 Optional<Booking> op=br.findById(id);
		   Booking b=op.get();
	
		    b.setStatus("PENDING");
		    
		    Map<String, Object> user =
		    	    restTemplate.getForObject(
		    	        "http://localhost:8081/user/booking/" + b.getUserId(),
		    	        Map.class
		    	    );

		    	String name = (String) user.get("name");
		    	String email = (String) user.get("u_email");

		    String subject = "Table Available! Complete Your Booking 🍽️";

		    String msg = "Hello " + name + ",\n\n"
		            + "Good news! Your waitlisted table is now available.\n\n"
		            + "Please complete your booking.\n"
		            + "Booking Date: " + b.getBookingDate() + "\n"
		            + "Time: " + b.getBookingTime() + "\n\n"
		            + "Status: PENDING\n\n"
		            + "Thank you!";
		    MimeMessage message = javaMailSender.createMimeMessage();

	        try {
	            MimeMessageHelper helper = new MimeMessageHelper(message, true);
	            helper.setTo(email);
	            helper.setSubject(subject);
	            helper.setText(msg, true); 
	            helper.setFrom("nikitashelke0025@gmail.com");

	            javaMailSender.send(message);
	            

	        } catch (MessagingException e) {
	            throw new RuntimeException("Error sending email", e);
	        }
		    return br.save(b);
		    
	}
	public List<Booking> getHotelBookings(int hotelId) {
		
		List<Booking> list=new ArrayList<>();
		for(Booking b:br.findAll()) {
			if(b.getHotelId()==hotelId) {
				
				list.add(b);
				
			}
		}
		return list;
	}
//
//	public List<Booking> getUserBookings(int userId) {
//		
//		List<Booking> list=new ArrayList<>();
//		for(Booking b:br.findAll()) {
//			if(b.getUserId()==userId) {
//				
//				list.add(b);
//				
//			}
//		}
//		return list;
//	}
//
//	public void cancelBooking(int id) {
//		Booking b = br.findById(id).get();
//        b.setStatus("CANCELLED");
//
//        restTemplate.delete("http://table-service/table/release/" + id);
//        br.save(b);
//		
//	}
//	
//	public Booking updateStatus(int id, String status) {
//
//	    Booking b = br.findById(id)
//	            .orElseThrow(() -> new RuntimeException("Booking not found"));
//
//	    b.setStatus(status);
//	    return br.save(b);
//	}
//	
//	
//	public int getSlotId(String time) {
//	    int hour = Integer.parseInt(time.split(":")[0]);
//
//	    if (hour >= 18 && hour < 20) return 1; // 6–8 PM
//	    if (hour >= 20 && hour < 22) return 2; // 8–10 PM
//	    if (hour >= 22) return 3;              // 10–12 PM
//
//	    return 1;
//	}
//	
//	
//	
	public Booking createFromWaitlist(Booking booking) {
		
		return br.save(booking);
	}
	public void refundupdateStatus(int id) {
		 Optional<Booking> op=br.findById(id);
		   Booking b=op.get();
	
		    b.setStatus("REFUNDED");
		    br.save(b);
		
	}
	
		}


