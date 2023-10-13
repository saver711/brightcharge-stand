import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { getErrorMessage } from 'src/app/core/api/api-utils';
import { AuditData, ErrorResponse } from 'src/app/core/api/api.model';
import { dateFormatter } from 'src/app/core/utils/date-formatter';
import { NoSpaceValidator } from 'src/app/core/validators/no-space-validator';
import {
  DocumentType,
  EditCpoDocumentsControls,
  EditOperatorFormControls,
  Operator,
} from '../../operator.model';
import { EditOperator } from '../../state/operator.actions';
import { egyptianPhoneNumberValidator } from 'src/app/core/validators/eg-phone-number';
import { EditOperatorGeneralComponent } from './edit-operator-general/edit-operator-general.component';

@Component({
  selector: 'bs-edit-operator',
  templateUrl: './edit-operator.component.html',
  styleUrls: ['./edit-operator.component.scss'],
})
export class EditOperatorComponent implements OnDestroy {
  operator!: Operator;
  editOperatorForm!: FormGroup<EditOperatorFormControls>;
  formSubmitted = false;
  isEditedLoading = false;
  isEditedSuccessfully = false;
  dataSubscription!: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private router: Router,
    private messageService: MessageService
  ) {
    this.getOperator();
    this.initializeForm();
  }

  @ViewChild(EditOperatorGeneralComponent)
  EditOperatorGeneralComponent!: EditOperatorGeneralComponent;

  getOperator() {
    this.dataSubscription = this.activatedRoute.data.subscribe({
      next: data => {
        const operator = data['data']['operator'];
        if (operator) {
          this.operator = operator;
        }
      },
    });
  }

  initializeForm() {
    const desiredOrder = [
      DocumentType.COMMERCIAL_REGISTER,
      DocumentType.TAX_REGISTER,
      DocumentType.ELECTRICITY_RETAIL_LICENSE,
    ];

    const operatorDocs = this.operator.cpoDocuments;
    const sortedOperatorDocs = [...operatorDocs].sort(
      ({ documentType: documentTypeA }, { documentType: documentTypeB }) => {
        if (documentTypeA && documentTypeB) {
          const typeA = desiredOrder.indexOf(documentTypeA);
          const typeB = desiredOrder.indexOf(documentTypeB);
          return typeA - typeB;
        } else {
          return 1;
        }
      }
    );
    const initialCpoDocuments: FormGroup<EditCpoDocumentsControls>[] =
      sortedOperatorDocs.map(doc => {
        return new FormGroup<EditCpoDocumentsControls>({
          id: new FormControl(doc.id || null, {
            validators: Validators.required,
          }),
          documentId: new FormControl(doc.documentId || null, [
            Validators.required,
            NoSpaceValidator.noWhitespaceValidator,
            Validators.pattern('^[0-9]*$'),
          ]),
          issuanceOffice: new FormControl(doc.issuanceOffice || null),
          issuanceDate: new FormControl(
            doc.issuanceDate ? new Date(doc.issuanceDate) : null
          ),
          documentType: new FormControl(doc.documentType),
          document: new FormControl(doc.document || null, {
            validators: Validators.required,
          }),
        });
      });

    this.editOperatorForm = new FormGroup({
      general: new FormGroup({
        id: new FormControl<number | null>(this.operator.id || null, {
          validators: Validators.required,
        }),
        logoImage: new FormControl<File | null>(
          this.operator.logoImage || null,
          {
            validators: Validators.required,
          }
        ),
        name: new FormControl<string | null>(this.operator.name || null, [
          Validators.required,
          NoSpaceValidator.noWhitespaceValidator,
        ]),
        email: new FormControl<string | null>(this.operator.email || null, {
          validators: Validators.email,
        }),
        phoneNumber: new FormControl<string | null>(
          this.operator.phoneNumber || null,
          {
            validators: [egyptianPhoneNumberValidator()],
          }
        ),
        landlineNumber: new FormControl<string | null>(
          this.operator.landlineNumber || null,
          {
            validators: Validators.pattern('^[0-9]+$'),
          }
        ),
        address: new FormControl<string | null>(this.operator.address || null),
      }),
      cpoDocuments: new FormArray(initialCpoDocuments),
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.editOperatorForm.invalid) {
      return;
    }
    const cpoDocuments = this.editOperatorForm?.value?.cpoDocuments?.map(
      ob => ({
        ...ob,
        issuanceDate: ob?.issuanceDate
          ? dateFormatter(new Date(ob?.issuanceDate))
          : null,
      })
    );
    const editOperatorFormDto = {
      cpoDocumentDto: cpoDocuments,
      ...this.editOperatorForm.value.general,
    };
    this.isEditedLoading = true;
    this.isEditedSuccessfully = false;
    const operatorMetadata: AuditData = {
      creationDate: this.operator.creationDate,
      lastModifiedDate: this.operator.lastModifiedDate,
      lastModifiedBy: this.operator.lastModifiedBy,
      createdBy: this.operator.createdBy,
    };
    this.store
      .dispatch(new EditOperator(editOperatorFormDto, operatorMetadata))
      .subscribe({
        next: () => {
          this.isEditedSuccessfully = true;
          this.isEditedLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Operator Edited',
            detail: `${editOperatorFormDto.name} operator new changes was saved successfully.`,
          });
        },
        error: (error: ErrorResponse) => {
          this.isEditedLoading = false;
          const errorMessage = getErrorMessage(error.error.errorCode);
          this.messageService.add({
            severity: 'error',
            summary: 'Operator Edit failed',
            detail: errorMessage,
          });
        },
      });
  }

  resetForm() {
    this.initializeForm();

    this.EditOperatorGeneralComponent.addInitialLogoFile(
      this.operator.logoImage
    );
    this.formSubmitted = false;
  }

  generalHasError() {
    return this.editOperatorForm.get('general')?.invalid && this.formSubmitted;
  }
  legalHasError() {
    return (
      this.editOperatorForm.get('cpoDocuments')?.invalid && this.formSubmitted
    );
  }

  viewDetails() {
    this.router.navigate([`/operators/${this.operator.id}`]);
  }
  onReject() {
    this.messageService.clear();
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }
}
