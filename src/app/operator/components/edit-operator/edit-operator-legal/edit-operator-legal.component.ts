import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FileSelectEvent } from 'primeng/fileupload';
import { isTouchDevice } from 'src/app/core/utils/isTouchDevice';
import {
  DocumentType,
  EditOperatorFormControls,
} from 'src/app/operator/operator.model';

@Component({
  selector: 'bs-edit-operator-legal',
  templateUrl: './edit-operator-legal.component.html',
  styleUrls: ['./edit-operator-legal.component.scss'],
})
export class EditOperatorLegalComponent implements OnInit {
  @Input()
  editOperatorForm!: FormGroup<EditOperatorFormControls>;
  files: File[] = [];

  @Input()
  formSubmitted = false;

  ngOnInit(): void {
    (this.editOperatorForm.get(`cpoDocuments`) as FormArray).controls.forEach(
      control => {
        const file = control.get(`document`)?.value;
        if (file) {
          this.files.push(file);
        }
      }
    );
  }

  get docControls() {
    const controls = (this.editOperatorForm.get('cpoDocuments') as FormArray)
      .controls;
    return controls;
  }

  isDocumentSelected(index: number) {
    const docValue = this.editOperatorForm.get(`cpoDocuments.${index}.document`)
      ?.value;
    return !!docValue;
  }
  removeDocument(index: number) {
    const formControl = this.editOperatorForm.get(
      `cpoDocuments.${index}.document`
    ) as FormControl;
    formControl.setValue(null);
  }
  shouldShowDocumentError(index: number) {
    const formControl = this.editOperatorForm.get(
      `cpoDocuments.${index}.document`
    ) as FormControl;

    return this.formSubmitted && formControl?.invalid;
  }

  onSelect(event: FileSelectEvent, index: number) {
    const theFile = event.currentFiles[0];
    const formControl = this.editOperatorForm.get(
      `cpoDocuments.${index}.document`
    ) as FormControl;
    formControl.setValue(null);
    if (theFile) formControl.setValue(theFile);
  }

  getDocumentLabel(documentType: DocumentType): string {
    switch (documentType) {
      case DocumentType.COMMERCIAL_REGISTER:
        return 'Commercial Register';
      case DocumentType.TAX_REGISTER:
        return 'Tax Register';
      case DocumentType.ELECTRICITY_RETAIL_LICENSE:
        return 'Electricity Retail License';
      default:
        return 'Document';
    }
  }

  isTouchDevice() {
    return isTouchDevice();
  }
}
