import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { merge, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { AppConstant } from 'src/app/Common/app-constant';
import { Utils } from 'src/app/Common/utils';
import { ProductListRequestModel } from '../Models/product-list-request-model';
import { ProductResponse } from '../Models/product-model';
import { ProductAddEditComponent } from '../product-add-edit/product-add-edit.component';
import { ProductListDataSource } from '../Service/product-datasourcr';
import { ProductService } from '../Service/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  matDialogRef: MatDialogRef<ProductAddEditComponent>;
  displayedColumns: string[] = ['category', 'name', 'description', 'details'];
  dataSource: ProductListDataSource;
  currentRoute: string;
  userRequest: ProductListRequestModel = new ProductListRequestModel();
  searchField = '';
  resultCount = 0;
  isLoadingData = false;
  loading = false;
  isLoader = false;
  private unsub$: ReplaySubject<boolean> = new ReplaySubject(1);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  searchProducts = new FormControl();
  constructor(
    public productService: ProductService,
    public router: Router,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.paginator.pageSize = AppConstant.defaultPageSizeOfGrid;
    this.paginator.pageSizeOptions = AppConstant.defultPageSizesOfGrid;
    this.dataSource = new ProductListDataSource(this.productService);
  }

  ngDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }


  loadProductList() {
    this.isLoadingData = true;
     const sortBy = Utils.isBlank(this.sort.active) ? 'category' : this.sort.active;
      if (this.sort.direction === 'asc') {
          this.userRequest.orderByDirection = 'desc';
      }
      if (Utils.isBlank(this.sort.direction)) {
          this.userRequest.orderByDirection = 'asc';
      }
      if (this.sort.direction === 'desc') {
          this.userRequest.orderByDirection = 'asc';
      }
    this.userRequest.take = this.paginator.pageSize;
    this.userRequest.skip = (this.paginator.pageIndex * this.paginator.pageSize)
    this.userRequest.orderByField =sortBy;
    this.userRequest.searchString = '';
    this.dataSource.loadProductList(this.userRequest);
    this.dataSource.loading$.subscribe(res => {
      this.isLoadingData = res;
    });
    this.dataSource.counter$.subscribe(count => {
      this.resultCount = count;
      this.paginator.length = this.resultCount;
      this.paginator.pageSize = AppConstant.defaultPageSizeOfGrid;
      this.userRequest.take = this.resultCount;
      this.userRequest.skip = (this.paginator.pageIndex * this.resultCount);
    });
  }


  

  ngAfterViewInit(): void {

    this.loadProductList();


    this.dataSource.counter$.pipe(
      tap((count) => {
        this.paginator.length = count;
        this.resultCount = count;
      })
    ).subscribe();

    merge(this.paginator.page, this.sort.sortChange).pipe(
      tap(() => {
        this.dataSource = new ProductListDataSource(this.productService);
        this.loadProductList();
      })
    ).subscribe();

    this.loadproductSearch();

  }

  addProduct(pageType: string) {
    if (pageType == 'add') {
      this.router.navigate(['AddProduct']);
    }
  }
  redirectToDetails(productData: ProductResponse, id: Number) {
    this.router.navigate(['productdetails', id]);
    this.productService.productResponse.next(productData);
  }


  loadproductSearch() {
    const sortBy = Utils.isBlank(this.sort.active) ? 'category' : this.sort.active;
    if (this.sort.direction === 'asc') {
        this.userRequest.orderByDirection = 'desc';
    }
    if (Utils.isBlank(this.sort.direction)) {
        this.userRequest.orderByDirection = 'asc';
    }
    if (this.sort.direction === 'desc') {
        this.userRequest.orderByDirection = 'asc';
    }

    this.userRequest.orderByField = sortBy;
    this.userRequest.skip = (this.paginator.pageIndex * AppConstant.defaultPageSizeOfGrid);
    const SearchString = this.searchProducts.valueChanges;
    SearchString.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => this.productService.searchProduct(value, AppConstant.defaultPageSizeOfGrid, this.userRequest.skip, this.userRequest))
    ).subscribe(response => {
        if (!Utils.isBlank(response) && response.data.length > 0) {
            this.dataSource.productSubject.next(response.data);
            this.dataSource.countSubject.next(response.count);
            this.dataSource.loading$.subscribe(res => {
                this.isLoadingData = res;
            });
            this.dataSource.counter$.subscribe(count => {
                this.resultCount = count;
                this.paginator.length = this.resultCount
            });
        } else {
            this.dataSource.productSubject.next([]);
            this.dataSource.countSubject.next(0);
            this.resultCount = response.count;
        }
    });
}


}