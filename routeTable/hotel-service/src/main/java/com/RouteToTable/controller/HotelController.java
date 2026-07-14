package com.RouteToTable.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.RouteToTable.bean.Hotel;
import com.RouteToTable.bean.Review;
import com.RouteToTable.service.HotelService;


import jakarta.servlet.http.HttpSession;




@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/hotel")
public class HotelController {
	
	@Autowired
	HotelService hs;
	
	@RequestMapping("/registerHotel")
	public ResponseEntity<?> registerHotel(@RequestBody Hotel h) {
		
		Map<String, Object> result=hs.saveHotel(h);
		return ResponseEntity.ok(result);
	}
	
	@RequestMapping("/loginHotel")
	public ResponseEntity<?> loginUser(@RequestBody Hotel h) {
		
		Map<String, Object> result = hs.loginHotel(h);
       	
		if(result != null) {
	        return ResponseEntity.ok(result);
	    } else {
	        return ResponseEntity.status(401).body("Invalid email or password");
	    }
		
	}
	@RequestMapping("/all")
	public List<Hotel> getHotels() {
		
	return	hs.allHotels();
	}
	
	
	//search
	private final String API_KEY = "AIzaSyAMj31HCM1vRrqxrfRnAEK9WQwOnxYpQ0E";

    @GetMapping("/route")
    public ResponseEntity<?> getRoute(
            @RequestParam String origin,
            @RequestParam String destination) {

        String url = "https://maps.googleapis.com/maps/api/directions/json"
                + "?origin=" + origin
                + "&destination=" + destination
                + "&key=" + API_KEY;

        RestTemplate rt = new RestTemplate();
        String response = rt.getForObject(url, String.class);

        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/search/route-hotels")
public List<Hotel> searchHotels(@RequestBody Map<String, Object> req) {

    List<Hotel> hotels = hs.allHotels();

    
    List<Map<String, Object>> routePoints =
            (List<Map<String, Object>>) req.get("routePoints");

    
    Map<String, Object> start = (Map<String, Object>) req.get("start");
    Map<String, Object> end = (Map<String, Object>) req.get("end");

    double startLat = Double.parseDouble(start.get("lat").toString());
    double startLng = Double.parseDouble(start.get("lng").toString());

    double endLat = Double.parseDouble(end.get("lat").toString());
    double endLng = Double.parseDouble(end.get("lng").toString());

   
    double distanceLimit = 20;

    String cuisine = req.get("cuisine") == null ? "" : req.get("cuisine").toString();
    String price = req.get("price") == null ? "" : req.get("price").toString();
    double rating = req.get("rating") == null ? 0 : Double.parseDouble(req.get("rating").toString());

    return hotels.stream()
            .filter(h -> isValidHotel(
                    h,
                    routePoints,
                    distanceLimit,
                    cuisine,
                    price,
                    rating,
                    startLat,
                    startLng,
                    endLat,
                    endLng
            ))
            .collect(Collectors.toList());
}

  
    private boolean isValidHotel(
            Hotel h,
            List<Map<String, Object>> routePoints,
            double distanceLimit,
            String cuisine,
            String price,
            double rating,
            double startLat,
            double startLng,
            double endLat,
            double endLng
    ) {

        
        double distStart = distance(startLat, startLng, h.getLatitude(), h.getLongitude());
        if (distStart <= 20) {
            return matchesFilters(h, cuisine, price, rating);
        }

        
        double distEnd = distance(endLat, endLng, h.getLatitude(), h.getLongitude());
        if (distEnd <= 20) {
            return matchesFilters(h, cuisine, price, rating);
        }

       
        for (int i = 0; i < routePoints.size(); i += 10) {

            Map<String, Object> p = routePoints.get(i);

            double lat = Double.parseDouble(p.get("lat").toString());
            double lng = Double.parseDouble(p.get("lng").toString());

            double dist = distance(lat, lng, h.getLatitude(), h.getLongitude());

            if (dist <= distanceLimit) {
                return matchesFilters(h, cuisine, price, rating);
            }
        }

        return false;
    }
    private boolean matchesFilters(Hotel h, String cuisine, String price, double rating) {

        boolean cuisineOk =
                (cuisine == null || cuisine.isEmpty()) ||
                h.getCuisineType().equalsIgnoreCase(cuisine);

        boolean priceOk =
                (price == null || price.isEmpty()) ||
                h.getPriceCategory().equalsIgnoreCase(price);

        boolean ratingOk =
                h.getRating() >= rating;

        return cuisineOk && priceOk && ratingOk;
    }
    
    private double distance(double lat1, double lon1, double lat2, double lon2) {

        double R = 6371;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) *
                Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
	
	
//	@PostMapping("/search/route-hotels")
//	public List<Hotel> searchRouteHotels(@RequestBody Map<String, Object> request) {
//
//	    List<Map<String, Double>> routePoints =
//	        (List<Map<String, Double>>) request.get("routePoints");
//
//	    double distance = Double.parseDouble(request.get("distance").toString());
//
//	    String cuisine = (String) request.get("cuisine");
//	    String price = (String) request.get("price");
//	    Double rating = request.get("rating") != null
//	            ? Double.parseDouble(request.get("rating").toString())
//	            : null;
//
//	    return hs.findHotelsNearRoute(routePoints, distance, cuisine, price, rating);
//	}
//	
	
	//single hotel 
	
	@GetMapping("/{id}")
	public ResponseEntity<?> getHotelById(@PathVariable int id) {

	    Hotel hotel = hs.findHotelById(id);

	    if (hotel!=null) {
	        return ResponseEntity.ok(hotel);
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                .body("Hotel not found");
	    }
	}
	@PutMapping("/status/{id}")
	public String updateStatus(@PathVariable int id, @RequestParam String status) {
	    hs.updateStatus(id, status);
	    return status;
	}
	
	
	  @PostMapping("/{id}/review")
	    public Hotel addReview(@PathVariable int id, @RequestBody Review review) {

		  
		  
	        Hotel h=hs.addReview(id,review);
			return h;
	    }
	  @GetMapping("/{id}/reviews")
	  public List<Review> getReviews(@PathVariable int id) {

		  
		  List<Review> list=hs.getReview(id);
	    return list;
	  }
	  
	  @PostMapping("/send-otp")
		public int sendOtp(@RequestBody Hotel hotel) {
		    String email = hotel.getH_email();
		   
		   int otp= hs.sendOTP(email);
		   
		   return otp;
		}
		
		
		
		@PostMapping("/reset-password")
		public Hotel resetPassword(@RequestBody Hotel hotel) {
			
			hotel=hs.resetPassword(hotel);
			return hotel;
		}
		
		@PutMapping("/update/{id}")
		public boolean profile(@PathVariable int id,@RequestBody Hotel u) {
			
			hs.profile(id,u);
			return true;
			
			
		}
}
