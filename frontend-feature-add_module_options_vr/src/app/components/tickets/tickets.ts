import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../core/services/filter.service';
import { ViewSearchFiltersComponent } from '../view-search-filters/view-search-filters.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, ViewSearchFiltersComponent],
  templateUrl: './tickets.html',
  styleUrls: ['./tickets.css'],
})
export class Tickets implements OnInit {
  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.filterService.setActiveView('tickets');
  }
}
