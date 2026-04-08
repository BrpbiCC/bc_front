import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from './components/sidebar/sidebar';
import { Topbar } from './components/topbar/topbar';
import { FilterService } from './core/services/filter.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, Sidebar, Topbar],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  sidebarCollapsed = false;
  sidebarHidden = false;

  constructor(
    private router: Router,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const width = window.innerWidth;
    this.sidebarHidden = (width <= 1024 && aspectRatio > 0.75) || width <= 768;
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  showSidebar() {
    this.sidebarCollapsed = false;
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');

    if (current === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }

  isLoginRoute(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }
}
