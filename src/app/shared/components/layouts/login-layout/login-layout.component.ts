import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss']
})
export class LoginLayoutComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  private auth = inject(AuthService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]], // Phone/Email/Domain
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { identifier, password } = this.loginForm.value;
      this.auth.login(identifier, password).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          this.isLoading = false;
          if (err?.error?.message) {
            this.errorMessage = `Error al iniciar sesión: ${err.error.message}`;
          } else {
            this.errorMessage = 'Error al iniciar sesión. Intenta de nuevo.';
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }
}
