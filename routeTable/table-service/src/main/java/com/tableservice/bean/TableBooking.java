package com.tableservice.bean;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class TableBooking {
	
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int id;

	    public int getId() {
		return id;
	}
	 public void setId(int id) {
		 this.id = id;
	 }
	 public int getTableId() {
		 return tableId;
	 }
	 public void setTableId(int tableId) {
		 this.tableId = tableId;
	 }
	 public int getBookingId() {
		 return bookingId;
	 }
	 public void setBookingId(int bookingId) {
		 this.bookingId = bookingId;
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
		private int tableId;
	    private int bookingId;

	    private LocalDate bookingDate;
	    private int slotId;
	    private int hotelId;

		public int getHotelId() {
			return hotelId;
		}
		public void setHotelId(int hotelId) {
			this.hotelId = hotelId;
		}

}
