import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroConfigurationComponent } from './zero-configuration.component';

describe('ZeroConfigurationComponent', () => {
  let component: ZeroConfigurationComponent;
  let fixture: ComponentFixture<ZeroConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZeroConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZeroConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
