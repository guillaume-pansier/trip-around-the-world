import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { ModalComponentComponent } from './modal-component.component';

describe('ModalComponentComponent', () => {
  let component: ModalComponentComponent;
  let fixture: ComponentFixture<ModalComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ModalModule.forRoot(), FormsModule],
      declarations: [ ModalComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
