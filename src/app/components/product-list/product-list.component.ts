import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {



  products : Product[] = [];

  currentCategoryId : number = 1 ;

  previousCategoryId: number = 1 ;

  searchMode : boolean = false;

  //new properties for pagination

  thePageNumber : number = 1 ;
  thePageSize :number = 5 ;
  theTotalElements = 0 ;

  previouskeyword : string = null ;

  constructor(private productService : ProductService,
              private cartService : CartService ,
              private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });

  }
  listProducts() {


    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProduct();
    } else {
      this.handlelistProducts();
    }

  }

  handleSearchProduct() {
   const theKeyWord = this.route.snapshot.paramMap.get('keyword');

   //if we have different keyword than previous set pagenumber to 1
   if(this.previouskeyword != theKeyWord){
     this.thePageNumber = 1 ;
   }

    this.previouskeyword = theKeyWord ;

    console.log(`keyword=${theKeyWord}  && thePageNumber=${this.thePageNumber}`)

   //search products using key word
   this.productService.searchProductsPaginate(this.thePageNumber -1 ,this.thePageSize,theKeyWord)
                                                            .subscribe(this.processResult());

  }

  handlelistProducts(){
    const hasCategory : boolean = this.route.snapshot.paramMap.has('id');



    if(hasCategory){

      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');

    } else {

      this.currentCategoryId = 1 ;

    }

   // Check if we have same category as previous

   // if we have differentt category than the previous then : set thePageNumber to 1

   if(this.previousCategoryId != this.currentCategoryId){
     this.thePageNumber = 1 ;
   }

   this.previousCategoryId = this.currentCategoryId;
   console.log(`currentCategoryId = ${this.currentCategoryId} && thePageNumber=${this.thePageNumber} `);



   // get the products using the category id + pageNum - 1 cause spring Rest counts from 0
    this.productService.getProductListPaginate(this.thePageNumber - 1 ,
                                               this.thePageSize,
                                               this.currentCategoryId).subscribe(this.processResult());

  }

  processResult(){
    return data => {
    this.products = data._embedded.products;

    this.thePageNumber = data.page.number + 1 ;
    this.thePageSize = data.page.size;
    this.theTotalElements = data.page.totalElements;


    };
  }

  updatePageSize(pageSize:number){
    this.thePageSize = pageSize ;
    this.thePageNumber = 1;
    this.listProducts();
  }

  // handles the event to add to cart
  addToCart(theProduct : Product){
     console.log(`the product name =  ${theProduct.name}`);
     console.log(`the product price =  ${theProduct.unitPrice}`);

     // Todo real work ......
     const theCartItem : CartItem = new CartItem(theProduct) ;
     this.cartService.addToCart(theCartItem);

  }



}
