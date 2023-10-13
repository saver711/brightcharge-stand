import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { AddStationFormControls } from 'src/app/station/station.model';

@Component({
  selector: 'bs-create-station-working-hours',
  templateUrl: './create-station-working-hours.component.html',
  styleUrls: ['./create-station-working-hours.component.scss'],
})
export class CreateStationWorkingHoursComponent implements OnChanges {
  checked = false;
  value = 0;
  timeFrom = ['AM', 'PM'];
  timeTo = ['PM', 'AM'];
  selectedTime = '';
  @Input() AddStationForm!: FormGroup<AddStationFormControls>;
  @Output() alwaysOpen = new EventEmitter();
  @Input() resetAlwaysOpen = false;

  ngOnChanges() {
    this.checked = this.resetAlwaysOpen;
  }

  get hoursControls() {
    return this.AddStationForm.get('workingHours') as FormArray;
  }
  disableFields(index: number, e: CheckboxChangeEvent) {
    const arrayControl = this.AddStationForm.get('workingHours') as FormArray;
    const item = arrayControl.at(index);
    if (e?.checked[0]) {
      item.get('openingTime')?.disable();
      item.get('closingTime')?.disable();
      item.get('fromTime')?.disable();
      item.get('toTime')?.disable();
    } else {
      item.get('openingTime')?.enable();
      item.get('closingTime')?.enable();
      item.get('fromTime')?.enable();
      item.get('toTime')?.enable();
    }
  }
  allDayChecked() {
    this.AddStationForm.get('alwaysOpen')?.patchValue(this.checked);
    if (this.checked) {
      (this.AddStationForm.get('workingHours') as FormArray).clear();
    } else {
      this.alwaysOpen.emit(this.checked);
    }
  }
}
