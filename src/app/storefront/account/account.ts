
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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

  mode: AuthMode = 'login';
  loading = false;
  errorMessage = '';
  successMessage = '';

  private registeredEmail = '';

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  registerForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  verifyForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  setMode(mode: AuthMode): void {
    this.mode = mode;
    this.errorMessage = '';
    this.successMessage = '';
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
        this.successMessage = 'Login successful! You are now signed in.';
      },
      error: error => this.handleError(error)
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
        this.registeredEmail = request.email;

        this.verifyForm.patchValue({
          email: request.email
        });

        this.mode = 'verify';
        this.successMessage = response || 'Registration successful. Check your email for the verification code.';
      },
      error: error => this.handleError(error)
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
        this.successMessage = 'Email verified successfully! You are now signed in.';
      },
      error: error => this.handleError(error)
    });
  }

  private handleError(error: any): void {
    this.loading = false;

    this.errorMessage =
      typeof error.error === 'string'
        ? error.error
        : error.error?.message || 'Something went wrong. Please try again.';
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
