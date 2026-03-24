import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantumTheoryComponent } from './quantum-theory.component';

describe('QuantumTheoryComponent', () => {
  let component: QuantumTheoryComponent;
  let fixture: ComponentFixture<QuantumTheoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuantumTheoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuantumTheoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
