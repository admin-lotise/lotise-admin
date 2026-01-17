import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MOCK_WINNERS, Winner } from '../../../shared/models/winner.model';

@Component({
  selector: 'app-winners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './winners.component.html',
  styleUrl: './winners.component.scss'
})
export class WinnersComponent implements OnInit {
  winners = signal<Winner[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadWinners();
  }

  loadWinners(): void {
    // Simulate API call
    setTimeout(() => {
      this.winners.set(MOCK_WINNERS);
      this.isLoading.set(false);
    }, 500);
  }

  toggleWinnerVisibility(winner: Winner): void {
    const winners = this.winners();
    const index = winners.findIndex(w => w.id === winner.id);
    
    if (index !== -1) {
      const updatedWinners = [...winners];
      updatedWinners[index] = {
        ...updatedWinners[index],
        isActive: !updatedWinners[index].isActive
      };
      this.winners.set(updatedWinners);
      
      // TODO: Call API to update
      console.log('Toggle visibility:', updatedWinners[index]);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getDefaultImage(): string {
    return 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=400&fit=crop';
  }

  // Agregar función para subir foto
  uploadPhoto(winner: Winner): void {
    // Abrir selector de archivo
    // Subir imagen
    // Actualizar winner con photoUrl
    // Marcar photoUploaded = true
  }
}