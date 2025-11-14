import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatsSection } from './chats-section';

describe('ChatsSection', () => {
  let component: ChatsSection;
  let fixture: ComponentFixture<ChatsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatsSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
