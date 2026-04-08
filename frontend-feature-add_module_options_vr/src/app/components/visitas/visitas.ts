import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../core/services/filter.service';

@Component({
  selector: 'app-visitas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visitas.html',
  styleUrls: ['./visitas.css'],
})
export class Visitas implements OnInit {
  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.filterService.setActiveView('visitas');
  }
}
