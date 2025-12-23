import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Raffle } from '../../../shared/models/raffle.model';
import { RafflesApiService } from '../../../core/http/raffles-api.service';

@Component({
  selector: 'app-raffle-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './raffle-detail.component.html',
  styleUrl: './raffle-detail.component.scss'
})
export class RaffleDetailComponent implements OnInit {
  raffleId = signal<string | null>(null);
  raffle = signal<Raffle | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rafflesApi: RafflesApiService
  ) {}

  async ngOnInit(): Promise<void> {
    this.raffleId.set(this.route.snapshot.paramMap.get('id'));
    
    if (this.raffleId()) {
      await this.loadRaffle();
    }
  }

  async loadRaffle(): Promise<void> {
    const id = this.raffleId();
    if (!id) return;

    try {
      this.isLoading.set(true);
      this.error.set(null);

      const tenantId = 'tenant-demo';
      const raffle = await firstValueFrom(
        this.rafflesApi.getRaffle(tenantId, id)
      );

      this.raffle.set(raffle);
    } catch (err: any) {
      this.error.set(err?.message || 'Error al cargar la rifa');
      console.error('Error loading raffle:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/raffles']);
  }

  onEdit(): void {
    this.router.navigate(['/raffles', this.raffleId(), 'edit']);
  }
}