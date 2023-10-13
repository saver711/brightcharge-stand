import { ChargePointModel } from './../models/charge-point-model.model';
import { ChargePointBrand } from './../models/charge-point-brand.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  constructor(private http: HttpClient) {}

  fetchBrands() {
    return this.http.get<ChargePointBrand[]>(
      `/api/backoffice/chargePoint/brands`
    );
  }
  getModelByBrandId(brandId: number) {
    return this.http.get<ChargePointModel[]>(
      `/api/backoffice/chargePoint/models/${brandId}`
    );
  }
}
