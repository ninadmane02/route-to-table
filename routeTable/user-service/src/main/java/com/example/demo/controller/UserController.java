package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.bean.User;
import com.example.demo.service.UserService;
import com.mysql.cj.Session;

import jakarta.servlet.http.HttpSession;


@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/user")
public class UserController {

	@Autowired
	UserService us;
	
	 
	
	@RequestMapping("/registerUser")
	public ResponseEntity<?> registerUser(@RequestBody User u) {
		
		Map<String, Object> result=us.saveUser(u);
		return ResponseEntity.ok(result);
	}
	
	@RequestMapping("/loginUser")
	public ResponseEntity<?> loginUser(@RequestBody User u) {
		
		Map<String, Object> result = us.loginUser(u);
       
		
		if(result != null) {
	        return ResponseEntity.ok(result);
	    } else {
	        return ResponseEntity.status(401).body("Invalid email or password");
	    }
		
	}
	

	@RequestMapping("/all")
	public List<User> getUsers() {
		
	return	us.allUsers();
	}
	
	@GetMapping("{id}")
	public User getUser(@PathVariable int id) {
		
	return	us.getUser(id);
	}
	
	@PutMapping("/status/{id}")
	public String updateStatus(@PathVariable int id, @RequestParam String status) {
	    us.updateStatus(id, status);
	    return status;
	}
	
	@PutMapping("/update/{id}")
	public boolean profile(@PathVariable int id,@RequestBody User u) {
		
		us.profile(id,u);
		return true;
		
		
	}
	
	
	@PostMapping("/send-otp")
	public int sendOtp(@RequestBody User user,HttpSession session) {
	    String email = user.getU_email();
	   
	   int otp= us.sendOTP(email);
	   
	   return otp;
	}
	
	
	
	@PostMapping("/reset-password")
	public User resetPassword(@RequestBody User user) {
		
	user=us.resetPassword(user);
		return user;
	}
	
	
	@GetMapping("/booking/{id}")
	public Map<String, Object> getUserData(@PathVariable int id) {

	    User u = us.getUser(id);

	    Map<String, Object> response = new HashMap<>();

	    response.put("name", u.getU_name());
	    response.put("u_email", u.getU_email());

	    return response;
	}
	
}
