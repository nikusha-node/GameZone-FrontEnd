
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ProfileService } from '../../core/services/profile';
import { AuthService } from '../../core/services/auth';

import { UserProfileResponse } from '../../models/profile/user-profile-response';
import { UpdateProfileRequest } from '../../models/profile/update-profile-request';
import { ChangePasswordRequest } from '../../models/profile/change-password-request';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {

  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  profile: UserProfileResponse | null = null;

  loading = true;
  saving = false;

  editMode = false;
  passwordMode = false;

  errorMessage = '';
  successMessage = '';

  profileForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required]
  });

  passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]
    ],
    confirmNewPassword: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.profileService.getMyProfile().subscribe({
      next: response => {
        this.profile = response;

        this.profileForm.patchValue({
          firstName: response.firstName,
          lastName: response.lastName
        });

        this.loading = false;
        this.cdr.markForCheck();
      },

      error: (error: HttpErrorResponse) => {
        this.loading = false;

        if (error.status === 401) {
          this.errorMessage =
            'Your session has expired. Please sign in again.';
        } else {
          this.errorMessage =
            'Unable to load your profile. Please try again.';
        }

        this.cdr.markForCheck();
      }
    });
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
    this.passwordMode = false;
    this.clearMessages();

    if (this.editMode && this.profile) {
      this.profileForm.patchValue({
        firstName: this.profile.firstName,
        lastName: this.profile.lastName
      });
    }
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const request: UpdateProfileRequest =
      this.profileForm.getRawValue();

    this.saving = true;
    this.clearMessages();

    this.profileService.updateProfile(request).subscribe({
      next: response => {
        this.profile = response;
        this.editMode = false;
        this.saving = false;
        this.successMessage = 'Profile updated successfully!';

        this.cdr.markForCheck();
      },

      error: error => {
        this.saving = false;
        this.errorMessage = this.getErrorMessage(error);
        this.cdr.markForCheck();
      }
    });
  }

  togglePassword(): void {
    this.passwordMode = !this.passwordMode;
    this.editMode = false;
    this.clearMessages();
    this.passwordForm.reset();
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const request: ChangePasswordRequest =
      this.passwordForm.getRawValue();

    if (request.newPassword !== request.confirmNewPassword) {
      this.errorMessage = 'New passwords do not match.';
      return;
    }

    this.saving = true;
    this.clearMessages();

    this.profileService.changePassword(request).subscribe({
      next: () => {
        this.saving = false;
        this.passwordMode = false;
        this.passwordForm.reset();
        this.successMessage = 'Password changed successfully!';

        this.cdr.markForCheck();
      },

      error: error => {
        this.saving = false;
        this.errorMessage = this.getErrorMessage(error);
        this.cdr.markForCheck();
      }
    });
  }

  private getErrorMessage(error: any): string {
    return error?.error?.Message ||
      error?.error?.message ||
      error?.error ||
      'Something went wrong. Please try again.';
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/account']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
