import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Amenity } from 'src/app/station/station.model';
import { amenities } from '@station/utils/constants';

@Component({
  selector: 'bs-create-station-amenities',
  templateUrl: './create-station-amenities.component.html',
  styleUrls: ['./create-station-amenities.component.scss'],
})
export class CreateStationAmenitiesComponent implements OnInit {
  searchValue = '';
  amenitiesForm: FormGroup;
  filteredAmenities: Amenity[] = [];
  amenitiesList: Amenity[] = amenities;
  constructor(private fb: FormBuilder) {
    this.amenitiesForm = this.fb.group({
      amenities: [[]],
    });
  }
  get amenities() {
    return this.amenitiesForm.get('amenities') as FormControl;
  }
  ngOnInit(): void {
    this.filteredAmenities = this.amenitiesList;
  }
  handleSearchAmenities(text: string) {
    if (text) {
      this.filteredAmenities = this.amenitiesList.filter(amenity =>
        amenity.name.toLowerCase().includes(text.toLowerCase())
      );
    } else this.filteredAmenities = this.amenitiesList;
  }
}
