import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongratulateCardComponent } from './congratulate-card.component';

describe('CongratulateCardComponent', () => {
  let component: CongratulateCardComponent;
  let fixture: ComponentFixture<CongratulateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CongratulateCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CongratulateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
