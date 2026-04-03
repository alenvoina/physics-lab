import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrbitalComponent } from './orbital.component';

describe('ClassicalComponent', () => {
  let component: OrbitalComponent;
  let fixture: ComponentFixture<OrbitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrbitalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrbitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
