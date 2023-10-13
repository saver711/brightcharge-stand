import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { getErrorMessage } from 'src/app/core/api/api-utils';
import { ErrorResponse } from 'src/app/core/api/api.model';
import { dateFormatter } from 'src/app/core/utils/date-formatter';
import { NoSpaceValidator } from 'src/app/core/validators/no-space-validator';
import {
  AddOperatorFormControls,
  CpoDocumentsControls,
  DocumentType,
  Operator,
} from '../../operator.model';
import { CreateOperator } from '../../state/operator.actions';
import { egyptianPhoneNumberValidator } from 'src/app/core/validators/eg-phone-number';
import { OperatorState } from '../../state/operator.state';
import { Observable, withLatestFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'bs-add-operator',
  templateUrl: './add-operator.component.html',
  styleUrls: ['./add-operator.component.scss'],
})
export class AddOperatorComponent implements OnInit {
  addOperatorForm!: FormGroup<AddOperatorFormControls>;
  formSubmitted = false;
  isCreatedLoading = false;
  newOperator!: Operator;

  constructor(
    private store: Store,
    private router: Router,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.initializeTheForm();
  }

  initializeTheForm() {
    const documentTypes = [
      DocumentType.COMMERCIAL_REGISTER,
      DocumentType.TAX_REGISTER,
      DocumentType.ELECTRICITY_RETAIL_LICENSE,
    ];
    const initialCpoDocuments: FormGroup<CpoDocumentsControls>[] =
      documentTypes.map(
        val =>
          new FormGroup<CpoDocumentsControls>({
            documentId: new FormControl(null, [
              Validators.required,
              NoSpaceValidator.noWhitespaceValidator,
              Validators.pattern('^[0-9]*$'),
            ]),
            issuanceOffice: new FormControl(null),
            issuanceDate: new FormControl(null),
            documentType: new FormControl(val),
            document: new FormControl(null, {
              validators: Validators.required,
            }),
          })
      );

    this.addOperatorForm = new FormGroup({
      general: new FormGroup({
        logoImage: new FormControl<File | null>(null, {
          validators: Validators.required,
        }),
        name: new FormControl<string | null>(null, [
          Validators.required,
          NoSpaceValidator.noWhitespaceValidator,
        ]),
        email: new FormControl<string | null>(null, {
          validators: Validators.email,
        }),
        phoneNumber: new FormControl<string | null>(null, {
          validators: [egyptianPhoneNumberValidator()],
        }),
        landlineNumber: new FormControl<string | null>(null, {
          validators: Validators.pattern('^[0-9]+$'),
        }),
        address: new FormControl<string | null>(null),
      }),
      cpoDocuments: new FormArray(initialCpoDocuments),
    });
  }

  @Select(OperatorState.operators) operators$!: Observable<Operator[]>;
  onSubmit() {
    this.formSubmitted = true;
    if (this.addOperatorForm.invalid) {
      return;
    }
    const cpoDocuments = this.addOperatorForm?.value?.cpoDocuments?.map(ob => ({
      ...ob,
      issuanceDate: ob?.issuanceDate
        ? dateFormatter(new Date(ob?.issuanceDate))
        : null,
    }));
    const addOperatorFormDto = {
      cpoDocumentDto: cpoDocuments,
      ...this.addOperatorForm.value.general,
    };
    this.isCreatedLoading = true;
    this.store
      .dispatch(new CreateOperator(addOperatorFormDto))
      .pipe(withLatestFrom(this.operators$))
      .subscribe({
        next: ([_, operators]) => {
          const operator = operators.find(
            operator => operator.name === addOperatorFormDto.name
          );
          if (operator) {
            this.newOperator = operator;
          }
          this.isCreatedLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Operator Created',
            detail: `${addOperatorFormDto.name} operator was created successfully.`,
          });
          this.resetForm();
        },
        error: (error: ErrorResponse) => {
          this.isCreatedLoading = false;
          const errorMessage = getErrorMessage(error.error.errorCode);
          this.messageService.add({
            severity: 'error',
            summary: 'Operator Creation failed',
            detail: errorMessage,
          });
        },
      });
  }

  resetForm() {
    this.initializeTheForm();
    this.formSubmitted = false;
  }

  generalHasError() {
    return this.addOperatorForm.get('general')?.invalid && this.formSubmitted;
  }
  legalHasError() {
    return (
      this.addOperatorForm.get('cpoDocuments')?.invalid && this.formSubmitted
    );
  }

  viewDetails() {
    if (this.newOperator) {
      this.router.navigate([`/operators/${this.newOperator.id}`]);
    }
  }
  onReject() {
    this.messageService.clear();
  }
}
