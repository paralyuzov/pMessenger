import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GifPicker } from './gif-picker';

describe('GifPicker', () => {
  let component: GifPicker;
  let fixture: ComponentFixture<GifPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GifPicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GifPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
