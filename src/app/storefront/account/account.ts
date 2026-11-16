
import {
  Component,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth';

import { LoginRequest } from '../../models/auth/login-request';
import { RegisterRequest } from '../../models/auth/register-request';
import { VerifyEmailRequest } from '../../models/auth/verify-email-request';

type AuthMode = 'login' | 'register' | 'verify';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './account.html',
  styleUrl: './account.scss'
})
export class Account {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  mode: AuthMode = 'login';

  loading = false;
  errorMessage = '';
  successMessage = '';
  verificationCompleted = false;

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  registerForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]
    ]
  });

  verifyForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  setMode(mode: AuthMode): void {
    this.mode = mode;
    this.clearMessages();
    this.cdr.markForCheck();
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const request: LoginRequest = this.loginForm.getRawValue();

    this.loading = true;
    this.clearMessages();

    this.authService.login(request).subscribe({
      next: () => {
        this.loading = false;
        this.cdr.markForCheck();
        this.router.navigate(['/profile']);
      },

      error: error => {
        this.handleError(error);
      }
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const request: RegisterRequest = this.registerForm.getRawValue();

    this.loading = true;
    this.clearMessages();

    this.authService.register(request).subscribe({
      next: response => {
        this.loading = false;

        this.verifyForm.patchValue({
          email: request.email
        });

        this.mode = 'verify';
        this.successMessage = response;

        this.cdr.markForCheck();
      },

      error: error => {
        this.handleError(error);
      }
    });
  }

  verifyEmail(): void {
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    const request: VerifyEmailRequest = this.verifyForm.getRawValue();

    this.loading = true;
    this.clearMessages();

    this.authService.verifyEmail(request).subscribe({
      next: () => {
        this.loading = false;
        this.verificationCompleted = true;
        this.cdr.markForCheck();
        this.router.navigate(['/profile']);
      },

      error: error => {
        this.handleError(error);
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  private handleError(error: any): void {
    this.loading = false;

    this.errorMessage =
      error?.error?.message ||
      error?.error?.Message ||
      error?.error ||
      'Something went wrong. Please try again.';

    this.cdr.markForCheck();
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
