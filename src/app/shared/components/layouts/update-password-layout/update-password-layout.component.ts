import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/auth.service';
import { finalize, tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-update-password-layout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './update-password-layout.component.html',
  styleUrl: './update-password-layout.component.scss'
})
export class UpdatePasswordLayoutComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  updatePasswordForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor() {
    this.updatePasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // ✅ NUEVO MÉTODO: Obtener mensajes de error específicos
  getErrorMessage(fieldName: string): string {
    const field = this.updatePasswordForm.get(fieldName);
    
    if (!field) return '';

    if (fieldName === 'password') {
      if (field.hasError('required')) {
        return 'La contraseña es requerida';
      }
      if (field.hasError('minlength')) {
        return 'La contraseña debe tener al menos 8 caracteres';
      }
    }

    if (fieldName === 'confirmPassword') {
      if (field.hasError('required')) {
        return 'Debes confirmar tu contraseña';
      }
      if (this.updatePasswordForm.hasError('mismatch')) {
        return 'Las contraseñas no coinciden';
      }
    }

    return '';
  }

  onSubmit() {
    if (this.updatePasswordForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.updatePasswordForm.controls).forEach(key => {
        this.updatePasswordForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const newPassword = this.updatePasswordForm.get('password')?.value;

    this.authService.updatePassword(newPassword)
      .pipe(
        tap((response) => {
          console.log('✅ Contraseña actualizada:', response);
          this.successMessage = 'Contraseña actualizada correctamente';
          
          // ✅ Redirigir al dashboard después de 1.5 segundos
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        }),
        catchError((error) => {
          console.error('❌ Error al actualizar contraseña:', error);
          this.errorMessage = error.message || 'Error al actualizar la contraseña';
          return throwError(() => error);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }
}
