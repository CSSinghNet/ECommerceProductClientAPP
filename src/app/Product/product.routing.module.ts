import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductAddEditComponent } from './product-add-edit/product-add-edit.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

const routes: Routes = [
    { path: 'productdetails', component: ProductDetailsComponent },
    { path: 'productdetails/:id', component: ProductAddEditComponent },
    { path: 'AddProduct', component: ProductAddEditComponent }
  ];
  @NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes)
    ],
    exports: [
      RouterModule
    ],
    declarations: []
  })
  export class ProductRoutingModule { }