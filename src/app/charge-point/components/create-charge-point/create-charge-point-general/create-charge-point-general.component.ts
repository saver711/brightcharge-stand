import { GeneralFormControls } from './../../../models/form-control.model';
import { BrandService } from './../../../../brand/services/brand.service';
import { ChargePointModel } from './../../../../brand/models/charge-point-model.model';
import { ChargePointBrand } from './../../../../brand/models/charge-point-brand.model';
import { OperatorState } from './../../../../operator/state/operator.state';
import { Operator } from './../../../../operator/operator.model';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, withLatestFrom } from 'rxjs';
import { ErrorResponse } from 'src/app/core/api/api.model';
import { getErrorMessage } from 'src/app/core/api/api-utils';
import { FetchOperators } from '@operator/state/operator.actions';

@Component({
  selector: 'bs-create-charge-point-general',
  templateUrl: './create-charge-point-general.component.html',
  styleUrls: ['./create-charge-point-general.component.scss'],
})
export class CreateChargePointGeneralComponent implements OnInit {
  // don't use any, add types
  generalForm!: FormGroup<GeneralFormControls>;
  isFetchingOperators = false;
  fetchingOperatorsError: string | null = null;
  operatorOptions: Operator[] = [];
  isFetchingBrands = false;
  fetchingBrandsError: string | null = null;
  brandOptions: ChargePointBrand[] = [];
  isFetchingModels = false;
  fetchingModelsError: string | null = null;
  modelOptions: ChargePointModel[] = [];
  accessibilityOptions = [
    {
      label: 'Public Access',
      value: 'PUBLIC_ACCESS',
    },
    {
      label: 'Private Access',
      value: 'PRIVATE_ACCESS',
    },
    { label: 'Commercial Access', value: 'COMMERCIAL_ACCESS' },
  ];

  formSubmitted = false;
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private brandService: BrandService
  ) {}

  @Select(OperatorState.operators) operators$!: Observable<Operator[]>;

  fetchOperators() {
    this.isFetchingOperators = true;
    this.fetchingOperatorsError = null;
    this.store
      .dispatch(new FetchOperators())
      .pipe(withLatestFrom(this.operators$))
      .subscribe({
        next: ([_, operators]) => {
          this.operatorOptions = operators;
          this.isFetchingOperators = false;
        },
        error: (error: ErrorResponse) => {
          this.isFetchingOperators = false;
          this.fetchingOperatorsError = getErrorMessage(error.error.errorCode);
        },
      });
  }

  fetchBrands() {
    this.isFetchingBrands = true;
    this.fetchingBrandsError = null;
    this.brandService.fetchBrands().subscribe({
      next: brands => {
        this.brandOptions = brands;
        this.isFetchingBrands = false;
      },
      error: (error: ErrorResponse) => {
        this.isFetchingBrands = false;
        this.fetchingBrandsError = getErrorMessage(error.error.errorCode);
      },
    });
  }

  fetchModels(brandId: number) {
    this.isFetchingModels = true;
    this.fetchingModelsError = null;

    this.brandService.getModelByBrandId(brandId).subscribe({
      next: models => {
        this.modelOptions = models;
        this.isFetchingModels = false;
      },
      error: (error: ErrorResponse) => {
        this.isFetchingModels = false;
        this.fetchingModelsError = getErrorMessage(error.error.errorCode);
      },
    });
  }

  ngOnInit(): void {
    this.fetchOperators();
    this.fetchBrands();
    this.generalForm = this.fb.group({
      name: ['', [Validators.required]],
      minPower: [null, [Validators.required]],
      maxPower: [null, [Validators.required]],
      access: ['', [Validators.required]],
      brandId: [null, [Validators.nullValidator]],
      modelId: [null, [Validators.nullValidator]],
      cpoId: [null, [Validators.required]],
    });
    this.generalForm.get('modelId')?.disable();
  }

  handleBrandChange(event: DropdownChangeEvent) {
    if (event.value) {
      this.generalForm.get('modelId')?.enable();
    }
    this.fetchModels(event.value);
  }
  handleBrandClear() {
    this.generalForm.get('modelId')?.disable();
    this.generalForm.get('modelId')?.setValue(null);
  }
  submitForm() {
    this.formSubmitted = true;
    // this.generalForm.updateValueAndValidity();
    // this.generalForm.markAllAsTouched();
  }
}
