import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionesCardComponent } from './cotizaciones-card.component';

describe('CotizacionesCardComponent', () => {
  let component: CotizacionesCardComponent;
  let fixture: ComponentFixture<CotizacionesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CotizacionesCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CotizacionesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
