import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FileSelectEvent } from 'primeng/fileupload';
import { isTouchDevice } from 'src/app/core/utils/isTouchDevice';
import {
  AddOperatorFormControls,
  DocumentType,
} from 'src/app/operator/operator.model';

@Component({
  selector: 'bs-new-operator-legal',
  templateUrl: './new-operator-legal.component.html',
  styleUrls: ['./new-operator-legal.component.scss'],
})
export class NewOperatorLegalComponent {
  @Input()
  addOperatorForm!: FormGroup<AddOperatorFormControls>;
  @Input()
  formSubmitted = false;

  get docControls() {
    return (this.addOperatorForm.get('cpoDocuments') as FormArray).controls;
  }

  isDocumentSelected(index: number) {
    return !!this.addOperatorForm.get(`cpoDocuments.${index}.document`)?.value;
  }
  removeDocument(index: number) {
    const formControl = this.addOperatorForm.get(
      `cpoDocuments.${index}.document`
    ) as FormControl;
    formControl.setValue(null);
  }
  shouldShowDocumentError(index: number) {
    const formControl = this.addOperatorForm.get(
      `cpoDocuments.${index}.document`
    ) as FormControl;

    return this.formSubmitted && formControl?.invalid;
  }

  onSelect(event: FileSelectEvent, index: number) {
    const theFile = event.currentFiles[0];
    const formControl = this.addOperatorForm.get(
      `cpoDocuments.${index}.document`
    ) as FormControl;
    formControl.setValue(null);
    if (theFile) formControl.setValue(theFile);
  }

  getDocumentLabel(documentType: DocumentType) {
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
