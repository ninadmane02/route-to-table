package com.paymentservice.service;

import java.util.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.razorpay.RazorpayClient;

@Service
public class PaymentService {

    private static final String KEY = "rzp_test_SdrTiCChXve6nk";
    private static final String SECRET = "0zZdT1TPjOlgZMDN7CaAyJv9";

    public String createRazorpayOrder(double amount) throws Exception {

        RazorpayClient client = new RazorpayClient(KEY, SECRET);

        JSONObject options = new JSONObject();
        options.put("amount", amount); 
        options.put("currency", "INR");
        options.put("payment_capture", 1);

        com.razorpay.Order order = client.orders.create(options);

        return order.toString();
    }
    public boolean verifySignature(String orderId, String paymentId, String signature) {

        try {
            String secret = "P5cgAZOgrLJ0FkCmFPwgH9uP";

            String data = orderId + "|" + paymentId;

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(), "HmacSHA256"));

            byte[] hash = mac.doFinal(data.getBytes());

            String generatedSignature = bytesToHex(hash);

            return generatedSignature.equals(signature);

        } catch (Exception e) {
            return false;
        }
}
    private String bytesToHex(byte[] bytes) {
        StringBuilder hex = new StringBuilder();
        for (byte b : bytes) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }
}