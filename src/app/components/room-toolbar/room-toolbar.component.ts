import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RoomToolbarService } from '../../services/room-toolbar.service';
import { IRoomToolbarItem } from '../../models/room-toolbar.model';

@Component({
  selector: 'app-room-toolbar',
  templateUrl: './room-toolbar.component.html',
  styleUrls: ['./room-toolbar.component.scss']
})
export class RoomToolbarComponent implements OnInit {
  @Input() toolbarConfig: IRoomToolbarItem[];
  @Output() toolbarEvent = new EventEmitter<string>();

  constructor(public roomToolbarSvc: RoomToolbarService) { }

  onSliderChange(e) {
    const name = e.source.name || '';
    const val = e.source.checked || false;
    this.roomToolbarSvc.setToolbarItemState(name, val);
  }

  onBtnClicked(name: string) {
    this.toolbarEvent.emit(name);
  }

  ngOnInit() {}

}
