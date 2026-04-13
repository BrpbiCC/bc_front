import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="logo-wrapper">
      <img
        *ngIf="!collapsed"
        src="/imagenes/logos/FrioCheck.svg"
        alt="FríaCheck Logo"
        class="logo-img logo-light"
      />
      <img
        *ngIf="!collapsed"
        src="/imagenes/logos/FrioCheckDark.svg"
        alt="FríaCheck Logo"
        class="logo-img logo-dark"
      />
      <img
        *ngIf="collapsed"
        src="/imagenes/logos/FrioCheck.svg"
        alt="FríaCheck Icon"
        class="logo-img logo-light"
      />
      <img
        *ngIf="collapsed"
        src="/imagenes/logos/FrioCheckDark.svg"
        alt="FríaCheck Icon"
        class="logo-img logo-dark"
      />
    </div>
  `,
  styleUrls: ['./logo.component.css'],
})
export class LogoComponent {
  @Input() collapsed = false;
}