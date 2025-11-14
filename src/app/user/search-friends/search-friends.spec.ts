import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFriends } from './search-friends';

describe('SearchFriends', () => {
  let component: SearchFriends;
  let fixture: ComponentFixture<SearchFriends>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFriends]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFriends);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
