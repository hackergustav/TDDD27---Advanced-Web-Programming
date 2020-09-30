import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockeditComponent } from './blockedit.component';

describe('BlockeditComponent', () => {
  let component: BlockeditComponent;
  let fixture: ComponentFixture<BlockeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
