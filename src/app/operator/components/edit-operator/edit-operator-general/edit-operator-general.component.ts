import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { BSFile } from 'src/app/core/api/api.model';
import { EditOperatorFormControls } from 'src/app/operator/operator.model';
@Component({
  selector: 'bs-edit-operator-general',
  templateUrl: './edit-operator-general.component.html',
  styleUrls: ['./edit-operator-general.component.scss'],
})
export class EditOperatorGeneralComponent implements OnInit {
  emailInputFocused = false;
  landlineNumberInputFocused = false;
  showDimensionsError = false;
  imageDimensionsError = false;
  nameInputFocused = false;
  @Input()
  editOperatorForm!: FormGroup<EditOperatorFormControls>;
  @Input()
  formSubmitted = false;

  @ViewChild('logoInput', { static: true }) logoInput!: FileUpload;
  get isImageSelected() {
    const isValid = !!(
      this.editOperatorForm.get('general.logoImage')?.value &&
      !this.imageDimensionsError
    );
    return isValid;
  }
  ngOnInit() {
    this.addInitialLogoFile();
  }

  addInitialLogoFile(file?: BSFile) {
    const theFile = this.editOperatorForm.get('general.logoImage')?.value;
    if (file) {
      this.logoInput.files = [file];
      this.imageDimensionsError = false;
      return;
    }
    if (theFile) {
      this.logoInput?.files.push(theFile);
    }
  }

  onSelect(event: FileSelectEvent) {
    this.editOperatorForm.patchValue({
      general: {
        logoImage: null,
      },
    });
    const theImage = event.currentFiles[0];

    if (theImage) {
      this.validateImageDimensions(theImage).then(imageDimensionsError => {
        if (!imageDimensionsError) {
          this.imageDimensionsError = false;
          this.editOperatorForm.patchValue({
            general: {
              logoImage: theImage,
            },
          });
        } else {
          this.imageDimensionsError = true;
          this.showDimensionsError = true;
        }
      });
    }
  }

  async validateImageDimensions(uploadedFile: File): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if (!uploadedFile.type.startsWith('image/')) {
        // Resolve with false for non-image files
        resolve(false);
        return;
      }

      const image = new Image();
      image.src = URL.createObjectURL(uploadedFile);

      image.onload = () => {
        const maxWidth = 128;
        const maxHeight = 128;

        const imageDimensionsError =
          image.width !== maxWidth || image.height !== maxHeight;

        // Resolve with the result
        resolve(imageDimensionsError);
      };
    });
  }

  removeImage() {
    this.editOperatorForm.patchValue({
      general: {
        logoImage: null,
      },
    });
  }

  shouldShowLogoError() {
    return (
      this.formSubmitted &&
      this.editOperatorForm.get('general.logoImage')?.invalid
    );
  }
}
