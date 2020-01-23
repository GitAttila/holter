import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { EventManager } from '@angular/platform-browser';

@Injectable()
export class ResizeService {

  get onResize$(): Observable<Window> {
    return this.resizeSub.asObservable();
  }

  private resizeSub: Subject<Window>;

  constructor(private evtManager: EventManager) {
    this.resizeSub = new Subject();
    this.evtManager.addGlobalEventListener(
      'window',
      'resize',
      this.onResize.bind(this)
    );
  }

  private onResize(event: UIEvent) {
    this.resizeSub.next(event.target as Window);
  }

}
