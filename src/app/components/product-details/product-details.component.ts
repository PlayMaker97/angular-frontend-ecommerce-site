import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product : Product = new Product() ;
  constructor(private productService : ProductService ,
              private cartService : CartService ,
               private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }
  handleProductDetails() {
    const theProductId = this.route.snapshot.paramMap.get('id');


   this.productService.getProduct(theProductId).subscribe(
     data => {
       this.product = data ;
           }
   );


  }

  addToCart(){
    console.log(`adding to cart :${this.product.name} ${this.product.unitPrice}`);
    const cartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);

  }



}
