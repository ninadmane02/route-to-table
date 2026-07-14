package com.tableservice.bean;

import java.time.LocalDate;

public class Booking {
	
	 private int id;
	    private int hotelId;
	    private int persons;
	    private LocalDate bookingDate;
	    private String bookingTime;
	    private int tableId;
	    private int userId;
	    public int getUserId() {
			return userId;
		}
		public void setUserId(int userId) {
			this.userId = userId;
		}
		public int getTableId() {
			return tableId;
		}
		public void setTableId(int tableId) {
			this.tableId = tableId;
		}
		public String getBookingTime() {
			return bookingTime;
		}
		public void setBookingTime(String bookingTime) {
			this.bookingTime = bookingTime;
		}
		private Integer slotId;
		public int getId() {
			return id;
		}
		public void setId(int id) {
			this.id = id;
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
		public Integer getSlotId() {
			return slotId;
		}
		public void setSlotId(Integer slotId) {
			this.slotId = slotId;
		}

}
