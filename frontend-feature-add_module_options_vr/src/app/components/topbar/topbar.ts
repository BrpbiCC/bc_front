import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterService, type FilterOption, type ViewRoute } from '../../core/services/filter.service';
import { ChileLocationsService } from '../../core/services/chile-locations.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { TopbarMobile } from '../topbar-mobile/topbar-mobile';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'success' | 'info';
  read: boolean;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective, TopbarMobile, RouterModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css'],
})
export class Topbar implements OnInit {
  allFilters: FilterOption[] = [];
  filterValues: { [key: string]: string | string[] } = {};
  ciudadesOptions: Array<{ value: string; label: string }> = [];
  comunasOptions: Array<{ value: string; label: string }> = [];
  showFiltersDropdown = false;
  showNotifications = false;
  showUserDropdown = false;
  showMobileMenu = false;
  openMultiSelect: string | null = null;
  dateRanges: { [key: string]: { start: string; end: string } } = {};
  
  recentViews: ViewRoute[] = [];
  carouselIndex = 0;
  carouselDirection: 'next' | 'prev' = 'next';
  animationKey = 0;
  canGoNext = false;
  canGoPrev = false;
  
  notifications: Notification[] = [];
  isDarkTheme = false;

  constructor(
    private router: Router,
    private filterService: FilterService,
    private chileLocations: ChileLocationsService
  ) {}

  ngOnInit(): void {
    this.notifications = [
      { id: 1, title: 'Ticket #1247 asignado', message: 'Se le ha asignado un nuevo ticket de mantención', time: 'Hace 5 min', type: 'alert', read: false },
      { id: 2, title: 'Visita completada', message: 'La visita al local #432 fue marcada como completada', time: 'Hace 1 hora', type: 'success', read: false },
      { id: 3, title: 'Sistema actualizado', message: 'El sistema ha sido actualizado a la versión 2.1', time: 'Hace 3 horas', type: 'info', read: true },
    ];

    this.loadFilters();
    this.loadCarousel();
    this.loadSavedTheme();

    this.router.events.subscribe(() => {
      this.loadFilters();
      this.animationKey++;
    });
  }

  private loadFilters(): void {
    this.allFilters = this.filterService.getFiltersForView(this.filterService.getActiveView());
    const currentFilters = this.filterService.getFilters();
    this.filterValues = { ...currentFilters };
    if (this.filterValues['region']) {
      this.onRegionChange();
    }
  }

  private loadCarousel(): void {
    this.recentViews = this.filterService.getCarouselViews();
    this.carouselIndex = this.filterService.getCarouselIndex();
    this.canGoNext = this.filterService.canGoNext();
    this.canGoPrev = this.filterService.canGoPrev();
  }

  nextCarousel(): void {
    this.carouselDirection = 'next';
    this.animationKey++;
    this.filterService.nextCarousel();
    this.loadCarousel();
  }

  prevCarousel(): void {
    this.carouselDirection = 'prev';
    this.animationKey++;
    this.filterService.prevCarousel();
    this.loadCarousel();
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  toggleFiltersDropdown(): void {
    this.showFiltersDropdown = !this.showFiltersDropdown;
    this.showNotifications = false;
    this.showUserDropdown = false;
  }

  closeFiltersDropdown(): void {
    this.showFiltersDropdown = false;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showFiltersDropdown = false;
    this.showUserDropdown = false;
  }

  closeNotifications(): void {
    this.showNotifications = false;
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
    if (this.showUserDropdown) {
      this.showNotifications = false;
      this.showFiltersDropdown = false;
    }
  }

  closeUserDropdown(): void {
    this.showUserDropdown = false;
  }

  markAllRead(): void {
    this.notifications.forEach((n) => (n.read = true));
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  getActiveFiltersCount(): number {
    return Object.entries(this.filterValues).filter(
      ([_, v]) => {
        if (Array.isArray(v)) return v.length > 0;
        return v !== '' && v !== null && v !== undefined;
      }
    ).length;
  }

  clearFilters(): void {
    this.filterValues = {};
    this.allFilters.forEach(f => f.join = undefined);
    this.filterService.updateFilters({});
  }

  isSelected(key: string, value: string): boolean {
    const val = this.filterValues[key];
    if (Array.isArray(val)) {
      return val.includes(value);
    }
    return false;
  }

  toggleFilterValue(key: string, value: string): void {
    const val = this.filterValues[key];
    if (!val || !Array.isArray(val)) {
      this.filterValues[key] = [value];
    } else if (val.includes(value)) {
      this.filterValues[key] = val.filter(v => v !== value);
    } else {
      this.filterValues[key] = [...val, value];
    }
    this.applyFilters();
  }

  toggleMultiSelect(key: string): void {
    this.openMultiSelect = this.openMultiSelect === key ? null : key;
  }

  getDateRange(key: string): { start: string; end: string } {
    return this.dateRanges[key] || { start: '', end: '' };
  }

  setDateRange(key: string, type: 'start' | 'end', value: string): void {
    if (!this.dateRanges[key]) {
      this.dateRanges[key] = { start: '', end: '' };
    }
    this.dateRanges[key][type] = value;
    this.applyFilters();
  }

  getDisplayValue(key: string): string {
    const val = this.filterValues[key];
    if (Array.isArray(val) && val.length > 0) {
      return val.join(', ');
    }
    const dateRange = this.dateRanges[key];
    if (dateRange && (dateRange.start || dateRange.end)) {
      const parts = [];
      if (dateRange.start) parts.push(dateRange.start);
      if (dateRange.end) parts.push(dateRange.end);
      return parts.join(' - ');
    }
    return '';
  }

  setFilterJoin(key: string, join: 'AND' | 'OR'): void {
    const filter = this.allFilters.find(f => f.key === key);
    if (filter) {
      filter.join = join;
    }
  }

  onRegionChange() {
    const regionId = this.filterValues['region'];
    if (regionId && typeof regionId === 'string') {
      this.ciudadesOptions = this.chileLocations.getCiudadesSelect(regionId);
      this.comunasOptions = this.chileLocations.getComunasSelect(regionId);
      if (this.filterValues['city']) this.filterValues['city'] = '';
    } else {
      this.ciudadesOptions = this.chileLocations.getCiudadesSelect();
      this.comunasOptions = this.chileLocations.getComunasSelect();
    }
    this.applyFilters();
  }

  getFilterOptions(filter: FilterOption): Array<{ value: string; label: string }> {
    if (filter.key === 'city') {
      return this.ciudadesOptions;
    }
    if (filter.key === 'commune') {
      return this.comunasOptions;
    }
    return filter.options || [];
  }

  applyFilters() {
    const activeFilters = Object.entries(this.filterValues)
      .filter(([_, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        return value !== '' && value !== null && value !== undefined;
      })
      .reduce(
        (acc, [key, value]) => {
          acc[key] = Array.isArray(value) ? value.join(',') : value;
          return acc;
        },
        {} as { [key: string]: string },
      );

    Object.entries(this.dateRanges).forEach(([key, range]) => {
      if (range.start || range.end) {
        activeFilters[`${key}_start`] = range.start;
        activeFilters[`${key}_end`] = range.end;
      }
    });

    this.filterService.updateFilters(activeFilters);
  }

  logout() {
    this.showUserDropdown = false;
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme === 'dark';
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDarkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
}