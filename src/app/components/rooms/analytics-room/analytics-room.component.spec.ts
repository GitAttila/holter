import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsRoomComponent } from './analytics-room.component';

describe('AnalyticsRoomComponent', () => {
  let component: AnalyticsRoomComponent;
  let fixture: ComponentFixture<AnalyticsRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
