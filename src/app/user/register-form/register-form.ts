import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Button } from '../../shared/button/button';
import { UserService } from '../../core/services/user.service';

interface RegisterFormValue {
  name: string;
  email: string;
  avatar: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  private readonly userService = inject(UserService);
  registerForm = new FormGroup(
    {
      name: new FormControl('', { nonNullable: true, validators: Validators.required }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      avatar: new FormControl('', { nonNullable: true }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
    },
    { validators: this.passwordsMatch() }
  );

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.getRawValue();
      this.userService.register(
        formData.name,
        formData.email,
        formData.avatar,
        formData.password,
        formData.confirmPassword
      );
    }
  }

  private passwordsMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');

      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { passwordsMismatch: true };
      }
      return null;
    };
  }
}
