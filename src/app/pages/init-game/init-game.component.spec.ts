import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { InitGameComponent } from './init-game.component';

describe('InitGameComponent', () => {
  let component: InitGameComponent;
  let fixture: ComponentFixture<InitGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitGameComponent ],
      providers : [
        FormBuilder
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
