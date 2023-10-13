import { OverlayListenerOptions } from 'primeng/api';

export const preventClosingPrimeOverlay = () => {
  return {
    listener: (event: Event, options?: OverlayListenerOptions) => {
      if (
        (event.type === 'scroll' && options?.valid) ||
        (event.type === 'click' && !options?.valid)
      ) {
        return false;
      }
      return true;
    },
  };
};

// 👀 HOW TO USE IT?
// .ts
/* 
getOverlayOptions(): OverlayOptions {
    return preventClosingPrimeOverlay('scroll');
  }
*/

// .html
/* 
<p-dropdown
    [overlayOptions]="getOverlayOptions()"
></p-dropdown>
*/
