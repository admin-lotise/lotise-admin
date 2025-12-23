import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  // Inputs
  title = input<string>('Confirmar acción');
  message = input<string>('¿Estás seguro de que deseas continuar?');
  confirmText = input<string>('Confirmar');
  cancelText = input<string>('Cancelar');
  type = input<'danger' | 'warning' | 'info' | 'success'>('info');
  icon = input<string>('fas fa-question-circle');
  
  // Outputs
  confirm = output<void>();
  cancel = output<void>();
  
  /**
   * Emitir confirmación
   */
  onConfirm(): void {
    this.confirm.emit();
  }
  
  /**
   * Emitir cancelación
   */
  onCancel(): void {
    this.cancel.emit();
  }

  /**
   * Cerrar al hacer clic en el overlay
   */
  onOverlayClick(event: MouseEvent): void {
    // Solo cerrar si se hace clic directamente en el overlay
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  /**
   * Obtener color del icono según el tipo
   */
  getIconColor(): string {
    const colors = {
      danger: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
      success: '#10b981'
    };
    return colors[this.type()] || colors.info;
  }

  /**
   * Obtener clase del botón de confirmación
   */
  getConfirmButtonClass(): string {
    const classes = {
      danger: 'btn-danger',
      warning: 'btn-warning',
      info: 'btn-primary',
      success: 'btn-success'
    };
    return classes[this.type()] || classes.info;
  }
}