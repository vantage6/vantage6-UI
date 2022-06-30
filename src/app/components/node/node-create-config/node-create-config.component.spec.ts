import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeCreateConfigComponent } from './node-create-config.component';

describe('NodeCreateConfigComponent', () => {
  let component: NodeCreateConfigComponent;
  let fixture: ComponentFixture<NodeCreateConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodeCreateConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeCreateConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
