package com.RouteToTable.bean;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;

@Entity
public class Hotel {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	
	public int h_id;
	public String h_name;
	public String h_city;
	public String h_contact;
	public String h_email;
	public String h_password;
	public String h_address;
	public String cuisineType;
	public String openingTime;
	public String closingTime;
	public double latitude;
	public double longitude;
	private String status="ACTIVE";
	
	private String priceCategory;
	
	@OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "hotel_id") // foreign key in Review table
    private List<Review> reviews;
	
	public List<Review> getReviews() {
		return reviews;
	}
	public void setReviews(List<Review> reviews) {
		this.reviews = reviews;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
	public String getPriceCategory() {
		return priceCategory;
	}
	public void setPriceCategory(String priceCategory) {
		this.priceCategory = priceCategory;
	}
	public double getRating() {
		return rating;
	}
	public void setRating(double rating) {
		this.rating = rating;
	}
	private double rating;
	
	
	public int getH_id() {
		return h_id;
	}
	public void setH_id(int h_id) {
		this.h_id = h_id;
	}
	public String getH_name() {
		return h_name;
	}
	public void setH_name(String h_name) {
		this.h_name = h_name;
	}
	public String getH_city() {
		return h_city;
	}
	public void setH_city(String h_city) {
		this.h_city = h_city;
	}
	public String getH_contact() {
		return h_contact;
	}
	public void setH_contact(String h_contact) {
		this.h_contact = h_contact;
	}
	public String getH_email() {
		return h_email;
	}
	public void setH_email(String h_email) {
		this.h_email = h_email;
	}
	public String getH_password() {
		return h_password;
	}
	public void setH_password(String h_password) {
		this.h_password = h_password;
	}
	public String getH_address() {
		return h_address;
	}
	public void setH_address(String h_address) {
		this.h_address = h_address;
	}
	public String getCuisineType() {
		return cuisineType;
	}
	public void setCuisineType(String cuisineType) {
		this.cuisineType = cuisineType;
	}
	public String getOpeningTime() {
		return openingTime;
	}
	public void setOpeningTime(String openingTime) {
		this.openingTime = openingTime;
	}
	public String getClosingTime() {
		return closingTime;
	}
	public void setClosingTime(String closingTime) {
		this.closingTime = closingTime;
	}
	public double getLatitude() {
		return latitude;
	}
	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	public double getLongitude() {
		return longitude;
	}
	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}


	
	
	
	
}
