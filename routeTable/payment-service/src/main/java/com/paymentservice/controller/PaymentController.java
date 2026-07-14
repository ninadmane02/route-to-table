package com.paymentservice.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.paymentservice.service.PaymentService;

@RestController
@RequestMapping("/payment")
@CrossOrigin
public class PaymentController {

    @Autowired
     PaymentService service;
    @Autowired
	RestTemplate restTemplate;
    @PostMapping("/create")
    public String create(@RequestBody Map<String, Object> data) throws Exception {

        double amount = Double.parseDouble(data.get("amount").toString());

       

        return service.createRazorpayOrder(amount);
    }
    @PostMapping("/verify")
    public String verifyPayment(@RequestBody Map<String, String> data) {

        String paymentId = data.get("razorpayPaymentId");
        String orderId = data.get("razorpayOrderId");
        String signature = data.get("razorpaySignature");
        String bookingId = data.get("bookingId");

        boolean isValid = service.verifySignature(orderId, paymentId, signature);

        if (isValid) {
            
        	

            return "SUCCESS";
        } else {
            return "FAILED";
        }
    }
}
