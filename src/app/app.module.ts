import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductDetailsComponent } from './Product/product-details/product-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductModule } from './Product/product.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ProductModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
