import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-password-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-password-layout.component.html',
  styleUrls: ['./update-password-layout.component.scss']
})
export class UpdatePasswordLayoutComponent {
  updateForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  private auth = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);

  constructor(private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    if (this.updateForm.valid) {
      this.isLoading = true;
      const { password } = this.updateForm.value;
      this.auth.updatePassword(password).subscribe({
        next: () => {
          this.successMessage = 'Contraseña actualizada correctamente';
          this.isLoading = false;
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1200);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.message || 'Error al actualizar la contraseña.';
        }
      });
    } else {
      this.updateForm.markAllAsTouched();
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.updateForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (fieldName === 'confirmPassword' && this.updateForm.hasError('mismatch')) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }
}
