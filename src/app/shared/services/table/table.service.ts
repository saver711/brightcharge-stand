import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class BsTableService {
  generateSearchCriteria(filters: object, advancedSearchCriteria: any[] = []) {
    let finalSearchCriteria;
    const inputCriteria = Object.entries(filters).map(([key, value]) => {
      return {
        filterKey: key,
        value: value?.value,
      };
    });

    if (inputCriteria.length > 0) {
      finalSearchCriteria = inputCriteria;
      return finalSearchCriteria;
    }
    finalSearchCriteria =
      advancedSearchCriteria.length > 0 ? advancedSearchCriteria : undefined;

    return finalSearchCriteria;
  }
}
