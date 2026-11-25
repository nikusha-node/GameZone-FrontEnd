import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProfileService } from '../../core/services/profile';
import { AuthService } from '../../core/services/auth';
import { UserProfileResponse } from '../../models/profile/user-profile-response';
import { UpdateProfileRequest } from '../../models/profile/update-profile-request';
import { ChangePasswordRequest } from '../../models/profile/change-password-request';
import { DecimalPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../core/services/order';
import { Order, OrderListResponse } from '../../models/order/order.model';
import { ReviewService } from '../../core/services/review';
import { CreateReviewRequest } from '../../models/order/review.model';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, FormsModule, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {

  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private reviewService = inject(ReviewService);

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


  getOrderStatus(status: string | number): string {
    const statuses = [
      'Pending',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled'
    ];

    if (typeof status === 'number') {
      return statuses[status] ?? 'Unknown';
    }

    if (/^\d+$/.test(status)) {
      return statuses[Number(status)] ?? 'Unknown';
    }

    return status;
  }
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

  reviewingProductId: number | null = null;
  reviewRating = 5;
  reviewComment = '';
  reviewError = '';
  reviewMessage = '';
  reviewSubmitting = false;

  openReview(productId: number): void {
    this.reviewingProductId = productId;
    this.reviewRating = 5;
    this.reviewComment = '';
    this.reviewError = '';
    this.reviewMessage = '';
  }

  closeReview(): void {
    this.reviewingProductId = null;
    this.reviewError = '';
  }

  submitReview(productId: number): void {
    if (this.reviewSubmitting) return;

    if (this.reviewRating < 1 || this.reviewRating > 5) {
      this.reviewError = 'Rating must be between 1 and 5.';
      return;
    }

    const request: CreateReviewRequest = {
      productId,
      rating: this.reviewRating,
      comment: this.reviewComment.trim()
    };

    this.reviewSubmitting = true;
    this.reviewError = '';

    this.reviewService.create(request).subscribe({
      next: () => {
        this.reviewMessage = 'Review submitted successfully!';
        this.reviewSubmitting = false;
        this.reviewingProductId = null;
      },
      error: error => {
        console.error('Review submission failed:', error);

        this.reviewError =
          error.error?.message ||
          error.error?.title ||
          'Unable to submit your review.';

        this.reviewSubmitting = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadOrders();
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

  private orderService = inject(OrderService);

  orders: Order[] = [];
  ordersLoading = false;
  ordersError = '';

  loadOrders(): void {
    this.ordersLoading = true;
    this.ordersError = '';

    this.orderService.getMyOrders(1, 20).subscribe({
      next: (response: OrderListResponse) => {
        this.orders = response.orders;
        this.ordersLoading = false;
        this.cdr.markForCheck();
      },
      error: error => {
        console.error('Failed to load orders:', error);
        this.ordersError = 'Unable to load your order history.';
        this.ordersLoading = false;
        this.cdr.markForCheck();
      }
    });
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
