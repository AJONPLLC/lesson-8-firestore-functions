import { LayoutModule } from '@angular/cdk/layout';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatButtonModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule,
  MatMenuModule,
} from '@angular/material';

import { BooksComponent } from './books.component';

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BooksComponent],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatCardModule,
        MatGridListModule,
        MatIconModule,
        MatMenuModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
