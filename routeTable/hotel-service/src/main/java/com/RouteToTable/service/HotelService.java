package com.RouteToTable.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.RouteToTable.bean.Hotel;
import com.RouteToTable.bean.Review;
import com.RouteToTable.dao.HotelRepository;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpSession;

@Service
public class HotelService {

	@Autowired
	HotelRepository hr;

	@Autowired
	private PasswordEncoder passwordEncoder;

	private final String SECRET = "mysecretkey";

	HttpSession session;
	
	public Map<String, Object> saveHotel(Hotel h) {

	    Map<String, Object> response = new HashMap<>();

	    
	    for (Hotel h1 : hr.findAll()) {

	        if (h1.getH_email().equals(h.getH_email())) {

	            response.put("status", "error");
	            response.put("message", "Hotel already registered with this Email");
	            return response;
	        }
	    }

	  
	    String hashedPassword = passwordEncoder.encode(h.getH_password());
	    h.setH_password(hashedPassword);

	    hr.save(h);

	   
	    response.put("status", "success");
	    response.put("message", "Hotel Registered Successfully");

	    return response;
	}
	
	
	public Map<String, Object> loginHotel(Hotel h) {
		
	    Map<String, Object> response = new HashMap<>();

	    for (Hotel h1 : hr.findAll()) {
//	    	if(h1.getStatus().equals("ACTIVE")) {
	    	
	    	 String email = h.getH_email() != null ? h.getH_email().trim() : "";
	    	    String password = h.getH_password() != null ? h.getH_password().trim() : "";
	    	   
	    	    String email1 = h1.getH_email() != null ? h1.getH_email().trim() : "";
	    	  System.out.println(email);
	    	  System.out.println(email1);
	        if (email.equals(email1)) {

	            System.out.println("Email matched");

	            boolean isMatch = passwordEncoder.matches(
	                    h.getH_password(),
	                    h1.getH_password()
	            );

	            System.out.println("Password match: " + isMatch);

	            if (isMatch) {

	                String token = Jwts.builder()
	                        .setSubject(h.getH_email())
	                        .setIssuedAt(new Date())
	                        .setExpiration(new Date(System.currentTimeMillis() + 86400000))
	                        .signWith(SignatureAlgorithm.HS256, SECRET)
	                        .compact();

	                response.put("token", token);
	                response.put("id", h1.getH_id());
	                response.put("email", h1.getH_email());
	                response.put("name", h1.getH_name());
	                response.put("role", "hotel");

	                return response;
	            }
	        }
//	    }
	    }
	    response.put("status", "error");
	    response.put("message", "Invalid email or password");

	    return response;
	}
	public List<Hotel> allHotels() {
		
		return (List<Hotel>) hr.findAll();
	}


	public List<Hotel> findHotelsNearRoute(
	        List<Map<String, Double>> routePoints,
	        double maxDistance,
	        String cuisine,
	        String price,
	        Double rating
	) {

	    List<Hotel> result = new ArrayList<>();

	    for (Hotel hotel : hr.findAll()) {

	        boolean matched = false;

	        for (Map<String, Double> point : routePoints) {

	            double d = distance(
	                    point.get("lat"),
	                    point.get("lng"),
	                    hotel.getLatitude(),
	                    hotel.getLongitude()
	            );

	            if (d <= maxDistance) {

	                if (matchesFilter(hotel, cuisine, price, rating)) {
	                    result.add(hotel);
	                }

	                matched = true;
	                break;
	            }
	        }

	        if (matched) continue;
	    }

	    return result;
	}
	private boolean matchesFilter(Hotel h, String cuisine, String price, Double rating) {

	    if (cuisine != null && !cuisine.isEmpty()) {
	        if (!h.getCuisineType().equalsIgnoreCase(cuisine)) {
	            return false;
	        }
	    }

	    if (price != null && !price.isEmpty()) {
	        if (!h.getPriceCategory().equalsIgnoreCase(price)) {
	            return false;
	        }
	    }

	    if (rating != null) {
	        if (h.getRating() < rating) {
	            return false;
	        }
	    }

	    return true;
	}
	private double distance(double lat1, double lon1, double lat2, double lon2) {

	    final int R = 6371;

	    double latDistance = Math.toRadians(lat2 - lat1);
	    double lonDistance = Math.toRadians(lon2 - lon1);

	    double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
	            + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
	            * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

	    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	    return R * c;
	}


	
	
	public Hotel findHotelById(int id) {
		java.util.Optional<Hotel> hotel = hr.findById(id);

	    if (hotel.isPresent()) {
	        return hotel.get();
	    } 
		return null;
	}
public void updateStatus(int id, String status) {
		
		Optional<Hotel> op=hr.findById(id);
		Hotel u=op.get();
		u.setStatus(status);
		hr.save(u);
		
	}


public Hotel addReview(int id, Review review) {
	Hotel hotel = hr.findById(id).orElseThrow();

    List<Review> reviews = hotel.getReviews();

    if (reviews == null) {
        reviews = new java.util.ArrayList<>();
    }

    reviews.add(review);
    hotel.setReviews(reviews);

   
    double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0);
    hotel.setRating(avg);

    return hr.save(hotel);
}


public List<Review> getReview(int id) {
	
	  Hotel hotel = hr.findById(id)
              .orElseThrow(() -> new RuntimeException("Hotel not found"));

      return hotel.getReviews() != null ? hotel.getReviews() : new ArrayList<>();
}

@Autowired
JavaMailSender javamailSender;

public int sendOTP(String email) {
	
	
for(Hotel h:hr.findAll()) {
	if(h.getH_email().equals(email)){
		
		 int otp = (int)(Math.random() * 9000) + 1000;
		 
		 String subject = "Your OTP Verification Code";

		 String msg = "<div style='font-family:Arial;padding:20px;'>"
		         + "<h2 style='color:#4CAF50;'>Welcome!</h2>"
		         + "<p>Your OTP for verification is:</p>"
		         + "<h1 style='color:#333; letter-spacing:3px;'>" + otp + "</h1>"
		         + "<p>This OTP is valid for a short time. Do not share it with anyone.</p>"
		         + "<br><p>— ROUTETOTABLE TEAM 🚀</p>"
		         + "</div>";

		 MimeMessage message = javamailSender.createMimeMessage();

	        try {
	            MimeMessageHelper helper = new MimeMessageHelper(message, true);
	            helper.setTo(email);
	            helper.setSubject(subject);
	            helper.setText(msg, true); 
	            helper.setFrom("nikitashelke0025@gmail.com");

	            javamailSender.send(message);
	            

	        } catch (MessagingException e) {
	            throw new RuntimeException("Error sending email", e);
	        }
	        return otp;
	       
		
	}
}
return 0;
	
}

public Hotel resetPassword(Hotel hotel) {
	
	for(Hotel h:hr.findAll()) {
		if(h.getH_email().equals(hotel.getH_email())){
			
			Optional<Hotel> op=hr.findById(h.getH_id());
				Hotel u1=op.get();
				 String hashedPassword = passwordEncoder.encode(hotel.getH_password());
				    u1.setH_password(hashedPassword);
				
				return hr.save(u1);
				
				
			}
		}
	return hotel;

	
	}

public void profile(int id, Hotel u) {
	
	Optional<Hotel> op=hr.findById(id);
	Hotel h1=op.get();
	h1.setH_city(u.getH_city());
	h1.setClosingTime(u.getClosingTime());
	h1.setCuisineType(u.getCuisineType());
	h1.setH_address(u.getH_address());
	h1.setH_contact(u.getH_contact());
	h1.setH_email(u.getH_email());
	h1.setH_name(u.getH_name());
	h1.setLatitude(u.getLatitude());
	h1.setLongitude(u.getLongitude());
	hr.save(h1);
	
	
	
	
}


}
