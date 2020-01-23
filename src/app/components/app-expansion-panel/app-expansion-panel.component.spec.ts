import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppExpansionPanelComponent } from './app-expansion-panel.component';

describe('AppExpansionPanelComponent', () => {
  let component: AppExpansionPanelComponent;
  let fixture: ComponentFixture<AppExpansionPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppExpansionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
