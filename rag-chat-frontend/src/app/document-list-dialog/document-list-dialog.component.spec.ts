import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentListDialogComponent } from './document-list-dialog.component';

describe('DocumentListDialogComponent', () => {
  let component: DocumentListDialogComponent;
  let fixture: ComponentFixture<DocumentListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentListDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
