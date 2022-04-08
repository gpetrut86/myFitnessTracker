import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassTrainingsComponent } from './pass-trainings.component';

describe('PassTrainingsComponent', () => {
  let component: PassTrainingsComponent;
  let fixture: ComponentFixture<PassTrainingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassTrainingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassTrainingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
