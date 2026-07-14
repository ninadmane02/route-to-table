package com.example.demo.service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.bean.User;
import com.example.demo.dao.UserRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpSession;

@Service
public class UserService {

	@Autowired
	UserRepository ur;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	 private final String SECRET = "mysecretkey";
	 
	 HttpSession session;
	
	 public Map<String, Object> saveUser(User u) {

		    Map<String, Object> response = new HashMap<>();

		   
		    for (User u1 : ur.findAll()) {

		        if (u1.getU_email().equals(u.getU_email())) {

		            response.put("status", "error");
		            response.put("message", "Email already exists");
		            return response;
		        }
		    }

		   
		    String hashedPassword = passwordEncoder.encode(u.getU_password());
		    u.setU_password(hashedPassword);

		    ur.save(u);

		    
		    response.put("status", "success");
		    response.put("message", "User Registered Successfully");

		    return response;
		
	}

	 public Map<String, Object> loginUser(User u) {

		 Map<String, Object> response = new HashMap<>();

	      for(User u1:ur.findAll()) {
	    	  if(u1.getStatus().equals("ACTIVE")) {
	    	  if(u1.getU_email().equals(u.getU_email())) {
	    		  System.out.println(u.getU_password());
	    		  System.out.println(u1.getU_password());
	       System.out.println(passwordEncoder.matches(u.getU_password(), u1.getU_password()));
	        if (passwordEncoder.matches(u.getU_password(), u1.getU_password())) {

	        	
	            String token = Jwts.builder()
	                    .setSubject(u.getU_email())
	                    .setIssuedAt(new Date())
	                    .setExpiration(new Date(System.currentTimeMillis() + 86400000)) 
	                    .signWith(SignatureAlgorithm.HS256, SECRET)
	                    .compact();

	            response.put("token", token);
	            response.put("id", u1.getU_id());
	            response.put("email", u1.getU_email());
	            response.put("name", u1.getU_name());
	            response.put("role", "traveler");

	            return response;
	        }
	      }
	      }
	      }

	      response.put("status", "error");
		    response.put("message", "Invalid email or password");

		    return response;
	    }

	public void getHotels() {
		
		
		
		
	}

	public List<User> allUsers() {
		
		return (List<User>) ur.findAll();
	}

	public User getUser(int id) {
		
		Optional<User> op=ur.findById(id);
		User u=op.get();
		return u;
	}

	public void updateStatus(int id, String status) {
		
		Optional<User> op=ur.findById(id);
		User u=op.get();
		u.setStatus(status);
		ur.save(u);
		
	}

	public void profile(int id, User u) {
		
		Optional<User> op=ur.findById(id);
		User u1=op.get();
		u1.setCity(u.getCity());
		u1.setU_email(u.getU_email());
		u1.setU_mobile(u.getU_mobile());
		u1.setU_name(u.getU_name());
		ur.save(u1);
		
		
	}
	@Autowired
	JavaMailSender javamailSender;

	public int sendOTP(String email) {
		
		
	for(User u:ur.findAll()) {
		if(u.getU_email().equals(email)){
			
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

public User resetPassword(User user) {
		
		for(User u:ur.findAll()) {
			if(u.getU_email().equals(user.getU_email())){
				
				Optional<User> op=ur.findById(u.getU_id());
					User u1=op.get();
					
					 String hashedPassword = passwordEncoder.encode(user.getU_password());
					    u1.setU_password(hashedPassword);
					
					return ur.save(u1);
					
					
				}
			}
		return user;
	
		
		}

	
	}
	

