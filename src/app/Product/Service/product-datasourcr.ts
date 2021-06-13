import { DataSource } from '@angular/cdk/table';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { catchError, finalize } from 'rxjs/operators';
import { ProductListRequestModel } from '../Models/product-list-request-model';
import { ProductResponse } from '../Models/product-model';
import { ResponseModel } from '../Models/response-model';
import { ProductService } from './product.service';

export class ProductListDataSource extends DataSource<ProductResponse> {
    public productSubject = new BehaviorSubject<ProductResponse[]>([]);
    public countSubject = new BehaviorSubject<number>(0);
    public counter$ = this.countSubject.asObservable();
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    constructor(private ProductService: ProductService) {
        super();
    }

    connect(): Observable<ProductResponse[]> {
        return this.productSubject.asObservable();
    }

    disconnect() {
        this.productSubject.complete();
        this.countSubject.complete();
        this.loadingSubject.complete();
    }

    loadProductList(requestProduct: ProductListRequestModel) {
        this.loadingSubject.next(true);

        return this.ProductService.GetProductList(requestProduct)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            ).subscribe((result: ResponseModel<ProductResponse>) => {    
                this.productSubject.next(result.data);
                this.countSubject.next(result.count);
            });
    }

}