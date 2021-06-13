import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ProductListRequestModel } from '../Models/product-list-request-model';
import { ProductResponse } from '../Models/product-model';
import { ResponseModel } from '../Models/response-model';
import { map } from 'rxjs/operators';
import { Utils } from 'src/app/Common/utils';
import { BehaviorSubject } from 'rxjs';
import { ProductAttributeModel } from '../Models/product-attribute-model';
import { ProductAttributeLookupModel } from '../Models/product-attribute-lookup-model';
import { ProductCategoryModel } from '../Models/product-category';
import { ProductViewModel } from '../Models/product-view-model';
@Injectable({ providedIn: 'root' })
export class ProductService {
    public productResponse = new BehaviorSubject<ProductResponse>(undefined);

    constructor(private httpClient: HttpClient) { }


    /**
       * Method is used to get Product list
       * @param requestProduct
       * @returns Observable of ResponseModel<ProductListRequestModel>
       * @author Chandrashekhar Singh on 12-Jun-2021 - Integrate list Product endpoint
       */
    GetProductList(requestProduct: ProductListRequestModel): Observable<ResponseModel<ProductResponse>> {
        let params = new HttpParams();
        params = params.append('Take', requestProduct.take.toString());
        params = params.append('Skip', requestProduct.skip.toString());
        params = params.append('SearchString', requestProduct.searchString);
        params = params.append('OrderByField', requestProduct.orderByField);
        params = params.append('OrderByDirection', requestProduct.orderByDirection);

        return this.httpClient.get<ResponseModel<ProductResponse>>(`${environment.apiUrl}/api/Product/GetProductDetails`, { params: params })
            .pipe(
                map(result => {
                    result = Utils.camelizeKeys(result);
                    return result as ResponseModel<ProductResponse>;
                })
            );
    }

    
    /**
  * Method is used to get Product list
       * @param requestProduct
       * @returns Observable of ResponseModel<ProductListRequestModel>
  * @author Chandrashekhar Singh on 12-Jun-2021 - Integrate list Product endpoint
  */
 searchProduct(searchString: string, take: number, skip: number, requestuser: ProductListRequestModel): Observable<ResponseModel<ProductResponse>> {
    let params = new HttpParams();
    params = params.append('Take', take.toString());
    params = params.append('Skip', skip.toString());
    params = params.append('SearchString', searchString);
    params = params.append('OrderByField', requestuser.orderByField);
    params = params.append('OrderByDirection', requestuser.orderByDirection);

    return this.httpClient.get<ResponseModel<ProductResponse>>(`${environment.apiUrl}/api/Product/GetProductDetails`, { params: params })
        .pipe(
            map(result => {
                result = Utils.camelizeKeys(result);
                return result as ResponseModel<ProductResponse>;
            })
        );
}


    /**
      * Method is used to get user by id
      * @param productCatId
      * @returns Observable of ProductAttributeLookupModel
      * @author  Chandrashekhar Singh  on 12-Jun-2021 - Integrate get Product Attribute details endpoint
      */
    GetProductAttributeName(categoryId: number): Observable<ProductAttributeLookupModel[]> {
        let params = new HttpParams();
        params = params.append('categoryId', categoryId.toString());
        return this.httpClient.get<ProductAttributeLookupModel[]>(`${environment.apiUrl}/api/Product/GetProductAttributeLoockupName`, { params: params })
            .pipe(
                map(result => {
                    return result as ProductAttributeLookupModel[];
                })
            );
    }
    /**
       * Method is used to get user by id
       * @param attributeId
       * @returns Observable of ProductAttributeModel
       * @author  Chandrashekhar Singh  on 12-Jun-2021 - Integrate get Product Attribute details endpoint
       */
    GetProductAttribute(attributeId: string): Observable<ProductAttributeModel> {
        let params = new HttpParams();
        params = params.append('attributeId', attributeId);
        return this.httpClient.get<ProductAttributeModel>(`${environment.apiUrl}/api/Product/GetProductAttribute`, { params: params })
            .pipe(
                map(result => {
                    return result as ProductAttributeModel;
                })
            );
    }

    /**
      * Method is used to get user by id
      * @param attributeId
      * @returns Observable of ProductAttributeModel
      * @author  Chandrashekhar Singh  on 12-Jun-2021 - Integrate get Product Attribute details endpoint
      */
    GetProductCategory(): Observable<ProductCategoryModel> {
        return this.httpClient.get<ProductCategoryModel>(`${environment.apiUrl}/api/Product/GetProductCategory`)
            .pipe(
                map(result => {
                    return result as ProductCategoryModel;
                })
            );
    }


    /**
         * Method is used to get user by id
         * @param attributeId
         * @returns Observable of ProductAttributeModel
         * @author  Chandrashekhar Singh  on 12-Jun-2021 - Integrate Add Product Attribute details endpoint
         */

    addProduct(Product: ProductViewModel): Observable<any> {
        return this.httpClient.post(`${environment.apiUrl}/api/Product/AddProduct`, Product);
    }


    /**
    * Method is used to edit Product
    * @param Product
    * @returns Observable of nothing
    * @author Chandrashekhar Singh  on 12-Jun-2021 - Integrate get Product Attribute details endpoint
    */
    updateProduct(Product: ProductViewModel): Observable<any> {
        return this.httpClient.put(`${environment.apiUrl}/api/Product/UpdateProduct`, Product);
    }

}