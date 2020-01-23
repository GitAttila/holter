import { Injectable, ElementRef } from '@angular/core';

@Injectable()
export class ChartService {
  getContainerSize(elem: ElementRef, zoomFactor?: number) {
    zoomFactor = zoomFactor || 1;
    zoomFactor <= 0 ? zoomFactor = 1 : zoomFactor = zoomFactor;
    return {
      containerWidth: elem.nativeElement.clientWidth,
      containerHeight: elem.nativeElement.clientHeight / zoomFactor
    };
  }
}
