import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FileViewModalComponent} from './file-view-modal.component';

describe('FileViewModalComponent', () => {
  let component: FileViewModalComponent;
  let fixture: ComponentFixture<FileViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileViewModalComponent]
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
