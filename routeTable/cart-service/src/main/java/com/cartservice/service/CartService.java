package com.cartservice.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cartservice.bean.Cart;
import com.cartservice.dao.CartRepository;


@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    
    public Cart addToCart(Cart cart) {

        List<Cart> allCartItems = (List<Cart>) cartRepository.findAll();

       
        for (Cart c : allCartItems) {
            if (c.getUserId()==cart.getUserId() &&
                c.getHotelId()==cart.getHotelId() &&
                c.getItemId()==cart.getItemId()) {

                c.setQuantity(c.getQuantity() + cart.getQuantity());
                return cartRepository.save(c);
            }
        }

        return cartRepository.save(cart);
    }

   
    public List<Cart> getCart(int userId, int hotelId) {

        List<Cart> allCartItems = (List<Cart>) cartRepository.findAll();

        return allCartItems.stream()
                .filter(c -> c.getUserId()==(userId)
                          && c.getHotelId()==(hotelId))
                .collect(Collectors.toList());
    }

   
    public void removeItem(int userId, int itemId) {

        List<Cart> allCartItems = (List<Cart>) cartRepository.findAll();

        for (Cart c : allCartItems) {
            if (c.getUserId()==(userId) &&
                c.getItemId()==(itemId)) {

                cartRepository.delete(c);
                break;
            }
        }
    }

	public void clearCart(int userId, int hotelId) {
		List<Cart> allItems = new ArrayList();

       
        for (Cart c : cartRepository.findAll()) {
            if (c.getUserId() == userId && c.getHotelId() == hotelId) {
                allItems.add(c);
            }
        }

      
        for (Cart c : allItems) {
            cartRepository.delete(c);
        }
	}
}