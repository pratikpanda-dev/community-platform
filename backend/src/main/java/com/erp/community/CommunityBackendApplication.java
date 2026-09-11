package com.erp.community;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableMethodSecurity
public class CommunityBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CommunityBackendApplication.class, args);
	}

}
