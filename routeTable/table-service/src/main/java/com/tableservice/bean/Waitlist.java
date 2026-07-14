package com.tableservice.bean;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

@Entity
public class Waitlist {

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int id;

	    private int userId;   
	    private int hotelId;
	    private int persons;

	    private LocalDate bookingDate;
	    @Lob
	    private String cartJson;
	    public String getCartJson() {
			return cartJson;
		}

		public void setCartJson(String cartJson) {
			this.cartJson = cartJson;
		}

		private String bookingTime;
	    public String getBookingTime() {
			return bookingTime;
		}

		public void setBookingTime(String bookingTime) {
			this.bookingTime = bookingTime;
		}

		private int slotId;

	    private String status; 

	    private LocalDateTime createdAt = LocalDateTime.now();

		public int getId() {
			return id;
		}

		public void setId(int id) {
			this.id = id;
		}

		public int getUserId() {
			return userId;
		}

		public void setUserId(int userId) {
			this.userId = userId;
		}

		public int getHotelId() {
			return hotelId;
		}

		public void setHotelId(int hotelId) {
			this.hotelId = hotelId;
		}

		public int getPersons() {
			return persons;
		}

		public void setPersons(int persons) {
			this.persons = persons;
		}

		public LocalDate getBookingDate() {
			return bookingDate;
		}

		public void setBookingDate(LocalDate bookingDate) {
			this.bookingDate = bookingDate;
		}

		public int getSlotId() {
			return slotId;
		}

		public void setSlotId(int slotId) {
			this.slotId = slotId;
		}

		public String getStatus() {
			return status;
		}

		public void setStatus(String status) {
			this.status = status;
		}

		public LocalDateTime getCreatedAt() {
			return createdAt;
		}

		public void setCreatedAt(LocalDateTime createdAt) {
			this.createdAt = createdAt;
		}

	
}
