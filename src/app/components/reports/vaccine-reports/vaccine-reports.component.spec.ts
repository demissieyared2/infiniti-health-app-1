import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VaccineReportsComponent} from './vaccine-reports.component';

describe('VaccineReportsComponent', () => {
  let component: VaccineReportsComponent;
  let fixture: ComponentFixture<VaccineReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VaccineReportsComponent]
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccineReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
