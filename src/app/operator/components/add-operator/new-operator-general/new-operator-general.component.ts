import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FileSelectEvent } from 'primeng/fileupload';
import { AddOperatorFormControls } from 'src/app/operator/operator.model';

@Component({
  selector: 'bs-new-operator-general',
  templateUrl: './new-operator-general.component.html',
  styleUrls: ['./new-operator-general.component.scss'],
})
export class NewOperatorGeneralComponent {
  emailInputFocused = false;
  landlineNumberInputFocused = false;
  showDimensionsError = false;
  imageDimensionsError = false;
  nameInputFocused = false;
  @Input()
  addOperatorForm!: FormGroup<AddOperatorFormControls>;
  @Input()
  formSubmitted = false;

  get isImageSelected() {
    return !!(
      this.addOperatorForm.get('general.logoImage')?.value &&
      !this.imageDimensionsError
    );
  }

  onSelect(event: FileSelectEvent) {
    this.addOperatorForm.patchValue({
      general: {
        logoImage: null,
      },
    });
    const theImage = event.currentFiles[0];
    if (theImage) {
      this.validateImageDimensions(theImage).then(imageDimensionsError => {
        if (!imageDimensionsError) {
          this.imageDimensionsError = false;
          this.addOperatorForm.patchValue({
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
    this.addOperatorForm.patchValue({
      general: {
        logoImage: null,
      },
    });
  }

  shouldShowLogoError() {
    return (
      this.formSubmitted &&
      this.addOperatorForm.get('general.logoImage')?.invalid
    );
  }
}
