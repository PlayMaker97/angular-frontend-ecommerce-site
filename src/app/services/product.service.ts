import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/Operators';
import { ProductCategory } from '../common/product-category';
@Injectable({
  providedIn: 'root'
})
export class ProductService {




   private baseUrl = 'http://localhost:8080/api/products';
   private CategoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

 // function to return product component  with pagination
  getProductListPaginate(thePage : number,
                           thePageSize : number ,
                              theCategoryId : number):Observable<GetResponceProduct>{
    //we build url based on produict id and page number and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                       + `&page=${thePage}&size=${thePageSize}`   ;

    return this.httpClient.get<GetResponceProduct>(searchUrl);

  }



   // function to return searched product component  with pagination
  searchProductsPaginate(thePage : number,
                        thePageSize : number ,
                        theKeyWord: string):Observable<GetResponceProduct>{
      //we build url based on keyword and page number and size
      const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`
                         + `&page=${thePage}&size=${thePageSize}`   ;

      return this.httpClient.get<GetResponceProduct>(searchUrl);

      }




  // we added categoryId :number to the method to return products by category
  getProductList(theCategoryId : number):Observable<Product[]>{

    //we build url based on produict id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);

  }
 // method to return products by keyword from DB
  searchProducts(theKeyWord: string):Observable<Product[]> {
   //build URL using key word
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`;

    return this.getProducts(searchUrl);
  }


  getProduct(theProductId: string) :Observable<Product> {

    //build the url based on the product ID
    const productUrl = `${this.baseUrl}/${theProductId}`;

     return this.httpClient.get<Product>(productUrl);
  }

  //returns list of products
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponceProduct>(searchUrl).pipe(map(response => response._embedded.products));
  }

  // return categories from data base
  getProductCategoriesList():Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponceProductCategory>(this.CategoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );

  }



}

//gets products from data base using a url
interface GetResponceProduct {
  _embedded: {
     products : Product[];
    },
    page: {
      size: number,
      totalElements: number,
      totalPages: number,
      number: number
    }

}


interface GetResponceProductCategory {
  _embedded: {
     productCategory: ProductCategory[]; }
}
