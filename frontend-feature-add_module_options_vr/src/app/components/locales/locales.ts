import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../core/services/filter.service';

@Component({
  selector: 'app-locales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './locales.html',
  styleUrls: ['./locales.css']
})
export class Locales implements OnInit {
  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.filterService.setActiveView('locales');
  }
}
