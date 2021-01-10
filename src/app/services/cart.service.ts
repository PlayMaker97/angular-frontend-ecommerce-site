import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  //our shoping cart Items
   cartItems : CartItem[] = [] ;

   totalPrice : Subject<number> = new Subject<number>() ;
   totalQuantity : Subject<number> = new Subject<number>() ;

  constructor() { }

  addToCart(theCartItem : CartItem){

   //check if already have the item in our Cart
   let alreadyExistsInCart : boolean = false ;
   let existingCartItem : CartItem = undefined ;

    if(this.cartItems.length > 0){
    //find the item in the Cart using Item Id

    existingCartItem = this.cartItems.find(item => item.id === theCartItem.id);

    }
    //check if item is found
    alreadyExistsInCart = (existingCartItem != undefined) ;


    if(alreadyExistsInCart){
      existingCartItem.quantity++;
    }else{
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();

    }
  computeCartTotals() {
    let totalPriceValue : number = 0 ;
    let totalQuantityValue : number = 0 ;

    for(let item of this.cartItems){
      totalPriceValue+= ( item.unitPrice * item.quantity );
      totalQuantityValue += item.quantity ;
         }
    // publish the new values so all subscribers gets them

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

     //log cart data for debuging
     this.logCartData (totalPriceValue , totalQuantityValue);

  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    for(let item of this.cartItems){
      const subTotalPrice = ( item.unitPrice * item.quantity ) ;
      console.log(`name: ${item.name} && quantity: ${item.quantity} && unitPrice: ${item.unitPrice} && total: ${subTotalPrice}  ` );
    }

    console.log(`cart total price is ${totalPriceValue} && cart total quantity is ${totalQuantityValue}  `);
    console.log('-----------');
  }


  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    if(cartItem.quantity === 0){
      this.remove(cartItem);
    } else{
      this.computeCartTotals();
    }

  }
  remove(cartItem: CartItem) {
   // get the index of the item in the array cartItems
   const itemIndex : number = this.cartItems.findIndex( item => item.id === cartItem.id);
   // if index found , remove the item from the cart items using its index
  if(itemIndex > -1){

    // splice function to remove by index and 1 for instance
    this.cartItems.splice(itemIndex,1);

    this.computeCartTotals();
  }


  }


}
