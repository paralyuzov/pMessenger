import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  loading = toSignal(this.userService.loading$);
  error = toSignal(this.userService.error$);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isControlInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.loginForm.get(controlName);
    if (control && control.invalid) {
      if (control.errors?.['required']) {
        return 'This field is required';
      }
      if (control.errors?.['email']) {
        return 'Invalid email address';
      }
      if (control.errors?.['minlength']) {
        return 'Password must be at least 6 characters long';
      }
    }
    return null;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.userService.login(email, password);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
