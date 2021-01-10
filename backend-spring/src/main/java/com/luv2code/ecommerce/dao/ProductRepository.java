package com.luv2code.ecommerce.dao;



import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

import com.luv2code.ecommerce.entity.Product;
@CrossOrigin
public interface ProductRepository extends JpaRepository<Product, Long> {
	
	//search by id 
	Page<Product> findByCategoryId(@RequestParam("id") Long id , Pageable pageable);
	
	//search by name 
	Page<Product> findByNameContaining(@RequestParam("name") String name , Pageable pageable);

}
