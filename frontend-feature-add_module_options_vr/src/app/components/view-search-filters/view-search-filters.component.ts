import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterService, type FilterOption } from '../../core/services/filter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-search-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="view-search-filters" *ngIf="shouldShowFilters">
      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-input-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            class="search-input"
            [placeholder]="getSearchPlaceholder()"
            [(ngModel)]="searchQuery"
            (input)="onSearchChange()"
          />
          <button
            *ngIf="searchQuery"
            class="clear-search-btn"
            (click)="clearSearch()"
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="filters-section" *ngIf="filters.length > 0">
        <div class="filters-header">
          <button
            class="filters-toggle-btn"
            (click)="toggleFilters()"
            [class.active]="showFilters"
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filtros</span>
            <span class="filters-count" *ngIf="getActiveFiltersCount() > 0">
              {{ getActiveFiltersCount() }}
            </span>
            <svg class="chevron-icon" [class.rotated]="showFilters" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        <!-- Filters Panel -->
        <div class="filters-panel" *ngIf="showFilters">
          <div class="filters-grid">
            <div class="filter-item" *ngFor="let filter of filters">
              <label class="filter-label">{{ filter.label }}</label>

              <!-- Input Filter -->
              <div *ngIf="filter.type === 'input'" class="filter-input-wrapper">
                <input
                  type="text"
                  class="filter-input"
                  [placeholder]="filter.placeholder"
                  [(ngModel)]="filterValues[filter.key]"
                  (input)="applyFilters()"
                />
              </div>

              <!-- Select Filter -->
              <div *ngIf="filter.type === 'select'" class="filter-select-wrapper">
                <select
                  class="filter-select"
                  [(ngModel)]="filterValues[filter.key]"
                  (change)="applyFilters()"
                >
                  <option value="">{{ filter.placeholder }}</option>
                  <option *ngFor="let opt of getFilterOptions(filter)" [value]="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <!-- Date Filter -->
              <div *ngIf="filter.type === 'date'" class="filter-date-wrapper">
                <input
                  type="date"
                  class="filter-date"
                  [(ngModel)]="filterValues[filter.key]"
                  (change)="applyFilters()"
                  [placeholder]="filter.placeholder"
                />
              </div>

              <!-- Multiselect Filter -->
              <div *ngIf="filter.type === 'multiselect'" class="filter-multiselect-wrapper">
                <div class="multiselect-display" (click)="toggleMultiSelect(filter.key)">
                  <span *ngIf="getMultiSelectDisplay(filter.key); else placeholder">
                    {{ getMultiSelectDisplay(filter.key) }}
                  </span>
                  <ng-template #placeholder>
                    <span class="placeholder">{{ filter.placeholder }}</span>
                  </ng-template>
                  <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                <div class="multiselect-dropdown" *ngIf="openMultiSelect === filter.key">
                  <label class="multiselect-option" *ngFor="let opt of getFilterOptions(filter)">
                    <input
                      type="checkbox"
                      [checked]="isSelected(filter.key, opt.value)"
                      (change)="toggleMultiSelectValue(filter.key, opt.value)"
                    />
                    <span>{{ opt.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="filters-actions">
            <button class="clear-filters-btn" (click)="clearFilters()" type="button">
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .view-search-filters {
      --surface-color: var(--surface-lowest, #ffffff);
      --input-bg: var(--surface-lowest, #ffffff);
      --text-color: var(--text-primary, #333333);
      --border-color: var(--border, #e0e0e0);
      --button-bg: var(--surface-low, #f8f9fa);
      --primary-color: var(--primary, #007bff);
      --accent-color: var(--error-alt, #dc3545);
      --secondary-bg: var(--text-secondary, #6c757d);
      --secondary-hover: var(--text-primary, #5a6268);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      background: var(--surface-color, #ffffff);
      color: var(--text-color, #333);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin-bottom: 1rem;
    }

    /* Search Section */
    .search-section {
      width: 100%;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      width: 20px;
      height: 20px;
      color: var(--text-secondary, #666);
      z-index: 1;
    }

    .search-input {
      width: 100%;
      padding: 12px 40px 12px 44px;
      border: 2px solid var(--border-color, #e0e0e0);
      border-radius: 8px;
      font-size: 14px;
      background: var(--input-bg, #ffffff);
      color: var(--text-color, #333);
      transition: border-color 0.2s ease;
    }

    .search-input::placeholder,
    .filter-input::placeholder,
    .filter-date::placeholder,
    .filter-select:invalid {
      color: var(--text-muted, #94a3b8);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary-color, #007bff);
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    .clear-search-btn {
      position: absolute;
      right: 12px;
      width: 20px;
      height: 20px;
      background: none;
      border: none;
      color: var(--text-secondary, #666);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .clear-search-btn:hover {
      background-color: var(--hover-bg, #f5f5f5);
      color: var(--text-color, #333);
    }

    /* Filters Section */
    .filters-section {
      width: 100%;
    }

    .filters-header {
      margin-bottom: 0.5rem;
    }

    .filters-toggle-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--button-bg, #f8f9fa);
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 6px;
      color: var(--text-color, #333);
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .filters-toggle-btn:hover {
      background: var(--hover-bg, #e9ecef);
    }

    .filters-toggle-btn.active {
      background: var(--primary-color, #007bff);
      color: white;
      border-color: var(--primary-color, #007bff);
    }

    .filters-count {
      background: var(--accent-color, #dc3545);
      color: white;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 600;
      min-width: 20px;
      text-align: center;
    }

    .chevron-icon {
      width: 16px;
      height: 16px;
      transition: transform 0.2s ease;
    }

    .chevron-icon.rotated {
      transform: rotate(180deg);
    }

    .filters-panel {
      margin-top: 1rem;
      padding: 1rem;
      background: var(--surface-color, #ffffff);
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 8px;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .filter-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .filter-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-color, #333);
      margin-bottom: 4px;
    }

    .filter-input,
    .filter-select,
    .filter-date {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 6px;
      font-size: 14px;
      background: var(--input-bg, #ffffff);
      color: var(--text-color, #333);
      transition: border-color 0.2s ease;
    }

    .filter-select option {
      background: var(--input-bg, #ffffff);
      color: var(--text-color, #333);
    }

    .filter-input:focus,
    .filter-select:focus,
    .filter-date:focus {
      outline: none;
      border-color: var(--primary-color, #007bff);
    }

    .filter-select-wrapper,
    .filter-input-wrapper,
    .filter-date-wrapper {
      position: relative;
    }

    /* Multiselect */
    .filter-multiselect-wrapper {
      position: relative;
    }

    .multiselect-display {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 6px;
      background: var(--input-bg, #ffffff);
      cursor: pointer;
      min-height: 36px;
      transition: border-color 0.2s ease;
    }

    .multiselect-display:hover {
      border-color: var(--primary-color, #007bff);
    }

    .multiselect-display .placeholder {
      color: var(--text-secondary, #666);
    }

    .multiselect-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--surface-color, #ffffff);
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      max-height: 200px;
      overflow-y: auto;
      margin-top: 2px;
    }

    .multiselect-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .multiselect-option:hover {
      background: var(--hover-bg, #f5f5f5);
    }

    .multiselect-option input[type="checkbox"] {
      margin: 0;
    }

    .filters-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color, #e0e0e0);
    }

    .clear-filters-btn {
      padding: 8px 16px;
      background: var(--secondary-bg, #6c757d);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .clear-filters-btn:hover {
      background: var(--secondary-hover, #5a6268);
    }

    :host-context([data-theme='dark']) .search-input,
    :host-context([data-theme='dark']) .filter-input,
    :host-context([data-theme='dark']) .filter-select,
    :host-context([data-theme='dark']) .filter-date,
    :host-context([data-theme='dark']) .multiselect-display,
    :host-context([data-theme='dark']) .multiselect-dropdown,
    :host-context([data-theme='dark']) .filters-panel {
      background: var(--surface-lowest, #1E2A3A);
      border-color: var(--border, #2E3E52);
      color: var(--text-primary, #FFFFFF);
    }

    :host-context([data-theme='dark']) .filter-select option,
    :host-context([data-theme='dark']) .multiselect-option {
      background: var(--surface-lowest, #1E2A3A);
      color: var(--text-primary, #FFFFFF);
    }

    :host-context([data-theme='dark']) .filter-date {
      color-scheme: dark;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .view-search-filters {
        padding: 0.75rem;
        gap: 0.75rem;
      }

      .filters-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      .search-input {
        padding: 10px 36px 10px 40px;
        font-size: 16px; /* Prevent zoom on iOS */
      }

      .filters-panel {
        padding: 0.75rem;
      }
    }

    @media (max-width: 480px) {
      .view-search-filters {
        padding: 0.5rem;
      }

      .filters-toggle-btn {
        padding: 6px 10px;
        font-size: 13px;
      }

      .filter-input,
      .filter-select,
      .filter-date {
        padding: 6px 10px;
        font-size: 13px;
      }

      .multiselect-display {
        padding: 6px 10px;
        min-height: 32px;
      }
    }
  `]
})
export class ViewSearchFiltersComponent implements OnInit, OnDestroy {
  shouldShowFilters = false;
  showFilters = false;
  searchQuery = '';
  filters: FilterOption[] = [];
  filterValues: { [key: string]: any } = {};
  openMultiSelect: string | null = null;

  private subscription: Subscription = new Subscription();

  // Vistas que deben mostrar los filtros de búsqueda
  private readonly FILTER_VIEWS = [
    'activos',
    'visitas',
    'tickets',
    'pedidos',
    'locales',
    'usuarios'
  ];

  constructor(
    private router: Router,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    // Verificar si la vista actual debe mostrar filtros
    this.checkIfShouldShowFilters();

    // Suscribirse a cambios de ruta
    this.subscription.add(
      this.router.events.subscribe(() => {
        this.checkIfShouldShowFilters();
      })
    );

    // Suscribirse a cambios en los filtros del servicio
    this.subscription.add(
      this.filterService.filters$.subscribe((filters) => {
        this.filterValues = { ...filters };
      })
    );

    // Suscribirse a cambios de vista activa
    this.subscription.add(
      this.filterService.activeView$.subscribe((view) => {
        if (this.FILTER_VIEWS.includes(view)) {
          this.filters = this.filterService.getFiltersForView(view);
          this.shouldShowFilters = true;
        } else {
          this.shouldShowFilters = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private checkIfShouldShowFilters(): void {
    const currentView = this.filterService.getActiveView();
    this.shouldShowFilters = this.FILTER_VIEWS.includes(currentView);

    if (this.shouldShowFilters) {
      this.filters = this.filterService.getFiltersForView(currentView);
      const currentFilters = this.filterService.getFilters();
      this.filterValues = { ...currentFilters };

      // Extraer búsqueda del filtro general si existe
      this.searchQuery = currentFilters['search'] || '';
    }
  }

  getSearchPlaceholder(): string {
    const view = this.filterService.getActiveView();
    const placeholders: { [key: string]: string } = {
      'activos': 'Buscar por código NFC, local, técnico...',
      'visitas': 'Buscar por local, técnico, fecha...',
      'tickets': 'Buscar por número, descripción, técnico...',
      'pedidos': 'Buscar por número, cliente, producto...',
      'locales': 'Buscar por nombre, dirección, comuna...',
      'usuarios': 'Buscar por nombre, email, rol...'
    };
    return placeholders[view] || 'Buscar...';
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  getActiveFiltersCount(): number {
    return Object.entries(this.filterValues).filter(([key, value]) => {
      if (key === 'search') return false; // No contar la búsqueda
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== null && value !== undefined;
    }).length;
  }

  getFilterOptions(filter: FilterOption): Array<{ value: string; label: string }> {
    return filter.options || [];
  }

  getMultiSelectDisplay(key: string): string {
    const value = this.filterValues[key];
    if (Array.isArray(value) && value.length > 0) {
      return value.join(', ');
    }
    return '';
  }

  isSelected(key: string, value: string): boolean {
    const val = this.filterValues[key];
    if (Array.isArray(val)) {
      return val.includes(value);
    }
    return false;
  }

  toggleMultiSelect(key: string): void {
    this.openMultiSelect = this.openMultiSelect === key ? null : key;
  }

  toggleMultiSelectValue(key: string, value: string): void {
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

  applyFilters(): void {
    const activeFilters = { ...this.filterValues };

    // Agregar búsqueda si existe
    if (this.searchQuery.trim()) {
      activeFilters['search'] = this.searchQuery.trim();
    } else {
      delete activeFilters['search'];
    }

    this.filterService.updateFilters(activeFilters);
  }

  clearFilters(): void {
    this.filterValues = {};
    this.searchQuery = '';
    this.filterService.updateFilters({});
  }
}