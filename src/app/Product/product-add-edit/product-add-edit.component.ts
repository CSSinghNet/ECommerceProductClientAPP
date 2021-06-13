import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstant } from 'src/app/Common/app-constant';
import { ProductAttributeLookupModel } from '../Models/product-attribute-lookup-model';
import { ProductCategoryModel } from '../Models/product-category';
import { ProductResponse } from '../Models/product-model';
import { ProductViewModel } from '../Models/product-view-model';
import { ProductService } from '../Service/product.service';

@Component({
  selector: 'app-product-add-edit',
  templateUrl: './product-add-edit.component.html',
  styleUrls: ['./product-add-edit.component.scss']
})
export class ProductAddEditComponent implements OnInit, AfterViewInit {
  productResponse: ProductResponse;
  productCategory: ProductCategoryModel;
  productAttribute: ProductAttributeLookupModel[];
  productForm: FormGroup;
  isCategorySelected: boolean = false;
  productViewModel: ProductViewModel;
  AppConstant = AppConstant;
  productId: number;
  isupdate: boolean = false;
  constructor(public productService: ProductService,
    public formBuilder: FormBuilder, public router: Router,
    public activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.setupForm();
    this.getCategory();
    this.getAttributeName();
  }

  ngAfterViewInit(): void {
    if (this.router.url !== AppConstant.addProduct) {
      this.getData();
      this.getAttributeValue();
      this.getCurrentRoute();
      this.isupdate = true;
    }
  }

  getCurrentRoute() {
    this.activateRoute.params.subscribe(params => {
      this.productId = +params['id'];
    })
  }

  setupForm() {
    this.productForm = this.formBuilder.group({
      productName: ['', [Validators.required, Validators.maxLength(200)]],
      categoryId: [null, [Validators.required]],
      productDescription: [''],
      attributeId: [null, [Validators.required]],
      attributeName: ['', Validators.required]
    });
  }
  get formControls() { return this.productForm.controls; }


  getAttributeName() {
    this.productForm.controls['categoryId'].valueChanges.subscribe(categoryId => {
      if (categoryId > 0) {
        this.productService.GetProductAttributeName(categoryId).subscribe(response => {
          this.productAttribute = response;
        });
      }

    });
  }


  getAttributeValue() {
    this.productForm.controls['attributeId'].valueChanges.subscribe(attributeId => {
      if (attributeId > 0)
        this.productService.GetProductAttribute(attributeId).subscribe(response => {
          if (response !== null)
            this.productForm.patchValue({ attributeName: response.attributeValue });
        });
    });
  }

  getData() {
    this.productService.productResponse.subscribe(response => {
      this.productResponse = response;
      if (response) {
        this.productForm.setValue({
          productName: response.prodName,
          categoryId: response.prodCatId,
          productDescription: response.prodDescription,
          attributeId: null,
          attributeName: null
        });
      }
    });
    this.getCategory();

  }
  getCategory() {
    this.productService.GetProductCategory().subscribe(response => {
      this.productCategory = response;
    });
  }

  closesideNav() {
    this.router.navigate(['/product/productdetails']);
  }

  saveProduct() {
    this.productViewModel = <ProductViewModel>this.productForm.value;
    if (this.router.url === AppConstant.addProduct) {
      this.productService.addProduct(this.productViewModel).subscribe(response => {
        if (response === 200) {
          alert("Product saved successfully");
          this.router.navigate(['/product/productdetails']);
        }
      });
    }
    else {
      this.productViewModel.productId = this.productId;
      this.productService.updateProduct(this.productViewModel).subscribe(response => {
        if (response === 200) {
          alert("Product updated successfully.");
          this.router.navigate(['/product/productdetails']);
        }
      });
    }
  }
}
