import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';


xdescribe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFireAuthModule
      ],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: { afAuth: { } } },
      ]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
  }));
});
