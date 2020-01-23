import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveformChartComponent } from './waveform-chart.component';

describe('WaveformChartComponent', () => {
  let component: WaveformChartComponent;
  let fixture: ComponentFixture<WaveformChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaveformChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaveformChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
