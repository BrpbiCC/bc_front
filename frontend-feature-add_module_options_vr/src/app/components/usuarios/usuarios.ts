import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../core/services/filter.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class Usuarios implements OnInit {
  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.filterService.setActiveView('usuarios');
  }
}
