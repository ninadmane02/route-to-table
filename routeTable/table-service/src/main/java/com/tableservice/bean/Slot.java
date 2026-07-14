package com.tableservice.bean;

import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Slot {
	
	 @Id
	
	    private int id;
	 
	 

	    private LocalTime startTime;
	    private LocalTime endTime;
		public int getId() {
			return id;
		}
		public void setId(int id) {
			this.id = id;
		}
		public LocalTime getStartTime() {
			return startTime;
		}
		public void setStartTime(LocalTime startTime) {
			this.startTime = startTime;
		}
		public LocalTime getEndTime() {
			return endTime;
		}
		public void setEndTime(LocalTime endTime) {
			this.endTime = endTime;
		}

}
