import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';
import { FilterService } from '../../core/services/filter.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeSwitcher],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css'],
})
export class Perfil implements OnInit {
  nombre = 'Administrador Principal';
  email = 'admin@friocheck.com';

  constructor(
    private filterService: FilterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.filterService.setActiveView('perfil');
  }

  guardar() {
    // lógica de guardado
  }
}
