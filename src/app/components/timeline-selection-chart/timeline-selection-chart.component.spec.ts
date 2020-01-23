import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineSelectionChartComponent } from './timeline-selection-chart.component';

describe('TimelineSelectionChartComponent', () => {
  let component: TimelineSelectionChartComponent;
  let fixture: ComponentFixture<TimelineSelectionChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineSelectionChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineSelectionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
