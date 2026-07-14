package com.cartservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cartservice.bean.Cart;
import com.cartservice.service.CartService;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/cart")
public class CartController {
	
	
	@Autowired
     CartService cartService;

    @PostMapping("/add")
    public Cart addToCart(@RequestBody Cart cart) {
        return cartService.addToCart(cart);
    }

    @GetMapping("/{userId}/{hotelId}")
    public List<Cart> getCart(
        @PathVariable int userId,
        @PathVariable int hotelId
    ) {
        return cartService.getCart(userId, hotelId);
    }

    @DeleteMapping("/remove")
    public void removeItem(@RequestParam int userId,
                           @RequestParam int itemId) {
        cartService.removeItem(userId, itemId);
    }
    @DeleteMapping("/clear/{userId}/{hotelId}")
    public void clearCart(@PathVariable int userId, @PathVariable int hotelId) {
        cartService.clearCart(userId, hotelId);
    }
}
