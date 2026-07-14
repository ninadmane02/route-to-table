package com.paymentservice.security;

import java.util.List;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfiguration {

	 @Bean
	    PasswordEncoder passwordEncoder() {
	        return new BCryptPasswordEncoder();
	    }


	    @Bean
	    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

	            http
	                .cors(cors -> cors.configurationSource(corsConfigurationSource())) 
	                .csrf(csrf -> csrf.disable())
	                .authorizeHttpRequests(auth -> auth
	                    .requestMatchers("/payment/**").permitAll()
	                    .anyRequest().authenticated()
	                );

	            return http.build();
	        }

	    @Bean
	    CorsConfigurationSource corsConfigurationSource() {

	            CorsConfiguration config = new CorsConfiguration();

	            config.setAllowedOrigins(List.of("http://localhost:3000"));
	            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
	            config.setAllowedHeaders(List.of("*"));
	            config.setAllowCredentials(true);

	            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	            source.registerCorsConfiguration("/**", config);

	            return source;
	        }
	    @Bean
	    @LoadBalanced
	    public RestTemplate restTemplate() {
	        return new RestTemplate();
	    }
}
