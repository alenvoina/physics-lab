import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuclearTheoryComponent } from './nuclear-theory.component';

describe('NuclearTheoryComponent', () => {
  let component: NuclearTheoryComponent;
  let fixture: ComponentFixture<NuclearTheoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuclearTheoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuclearTheoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
