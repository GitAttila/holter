import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IRoomToolbarItem } from '../models/room-toolbar.model';

@Injectable()
export class RoomToolbarService {
  public roomToolbarConfig: IRoomToolbarItem[] =
  [
    {
      type: 'slide-toggle',
      label: 'inspector',
      name: 'inspector',
      color: 'accent',
      disabled: false,
      value: true
    },
    {
      type: 'slide-toggle',
      label: 'settings',
      name: 'settings',
      color: 'accent',
      disabled: false,
      value: false
    },
    {
      type: 'slide-toggle',
      label: 'full width',
      name: 'fullwidth',
      color: 'accent',
      disabled: false,
      value: false
    },
    {
      type: 'button',
      label: 'analyze',
      name: 'analyze',
      color: 'primary',
      disabled: false,
      value: false
    }
  ];

  private configUpdated = new BehaviorSubject<IRoomToolbarItem[]>(this.roomToolbarConfig);

  setToolbarItemState(name: string, val: boolean | string) {
    const updatedConfig: IRoomToolbarItem[] = [...this.roomToolbarConfig];
    const found = updatedConfig.find(item => item.name === name);
    found.value = val;
    this.configUpdated.next(updatedConfig);
    // console.log(name, val, found, this.configUpdated.getValue());
  }

  getToolbarItemState(name: string): IRoomToolbarItem {
    const latestConfig = this.getUpdatedConfig();
    const found = latestConfig.find(item => item.name === name);
    return found;
  }

  getUpdatedConfig() {
    return this.configUpdated.getValue();
  }

  getRoomToolbarListener() {
    return this.configUpdated.asObservable();
  }

}
