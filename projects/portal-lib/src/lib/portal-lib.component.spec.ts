import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalLibComponent } from './portal-lib.component';

describe('PortalLibComponent', () => {
  let component: PortalLibComponent;
  let fixture: ComponentFixture<PortalLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortalLibComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
