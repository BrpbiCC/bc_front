import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FilterService, type FilterOption } from '../../core/services/filter.service';
import { ChileLocationsService } from '../../core/services/chile-locations.service';

interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  displayLabel: string;
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatFormFieldModule],
  template: `
    <div class="filters-section" *ngIf="filters.length > 0 && !hidePrimary">
      <!-- Main Filter Bar -->
      <div class="filters-main-bar">
        <div class="filters-primary">
          <!-- Primary Filters -->
          <div class="filter-item" *ngFor="let filter of primaryFilters">
            <label class="filter-label">{{ filter.label }}</label>

            <div *ngIf="filter.type === 'input'" class="filter-input-wrapper">
              <input
                type="text"
                [placeholder]="filter.placeholder"
                class="filter-input"
                [(ngModel)]="filterValues[filter.key]"
                (change)="applyFilters()"
              />
            </div>

            <div *ngIf="filter.type === 'select'" class="filter-select-wrapper">
              <mat-form-field appearance="outline">
                <mat-select
                  [(ngModel)]="filterValues[filter.key]"
                  (selectionChange)="filter.key === 'region' ? onRegionChange() : applyFilters()"
                  [placeholder]="filter.placeholder || ''"
                >
                  <mat-option *ngFor="let opt of getFilterOptions(filter)" [value]="opt.value">
                    {{ opt.label }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div *ngIf="filter.type === 'date'" class="filter-date-wrapper">
              <input
                type="date"
                class="filter-date"
                [(ngModel)]="filterValues[filter.key]"
                (change)="applyFilters()"
              />
            </div>
          </div>
        </div>

        <!-- Advanced Filters Button -->
        <div class="filters-actions" *ngIf="secondaryFilters.length > 0">
          <button
            class="btn-advanced-filters"
            [class.active]="showAdvancedFilters"
            (click)="toggleAdvancedFilters()"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
            Filtros Avanzados
            <span class="badge" *ngIf="getSecondaryActiveCount() > 0">{{
              getSecondaryActiveCount()
            }}</span>
          </button>
        </div>
      </div>

      <!-- Advanced Filters Panel -->
      <div
        class="filters-advanced-panel"
        *ngIf="showAdvancedFilters && secondaryFilters.length > 0"
      >
        <div class="advanced-filters-grid">
          <div class="filter-item" *ngFor="let filter of secondaryFilters">
            <label class="filter-label">{{ filter.label }}</label>

            <div *ngIf="filter.type === 'input'" class="filter-input-wrapper">
              <input
                type="text"
                [placeholder]="filter.placeholder"
                class="filter-input"
                [(ngModel)]="filterValues[filter.key]"
                (change)="applyFilters()"
              />
            </div>

            <div *ngIf="filter.type === 'select'" class="filter-select-wrapper">
              <mat-form-field appearance="outline">
                <mat-select
                  [(ngModel)]="filterValues[filter.key]"
                  (selectionChange)="filter.key === 'region' ? onRegionChange() : applyFilters()"
                  [placeholder]="filter.placeholder || ''"
                >
                  <mat-option *ngFor="let opt of getFilterOptions(filter)" [value]="opt.value">
                    {{ opt.label }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div *ngIf="filter.type === 'date'" class="filter-date-wrapper">
              <input
                type="date"
                class="filter-date"
                [(ngModel)]="filterValues[filter.key]"
                (change)="applyFilters()"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Active Filters Chips -->
      <div class="filters-active" *ngIf="activeFilters.length > 0">
        <div class="filters-chips">
          <div class="filter-chip" *ngFor="let filter of activeFilters">
            <span class="chip-label">{{ filter.displayLabel }}: {{ filter.value }}</span>
            <button class="chip-remove" (click)="removeFilter(filter.key)" title="Eliminar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
        <button class="btn-clear-all" (click)="clearFilters()">Limpiar todo</button>
      </div>

      <!-- Loading Indicator -->
      <div class="filters-loading" *ngIf="isLoading">
        <div class="spinner"></div>
        <span>Actualizando resultados...</span>
      </div>

      <!-- Results Counter -->
      <div class="filters-results" *ngIf="totalResults > 0">
        Mostrando <strong>{{ filteredResults }}</strong> de
        <strong>{{ totalResults }}</strong> resultados
      </div>
    </div>
  `,
  styles: [
    `
      .filters-section {
        background: var(--surface);
        border-bottom: 1px solid var(--border);
      }

      .filters-main-bar {
        display: flex;
        gap: 1rem;
        align-items: flex-end;
        padding: 0.5rem 1rem;
        flex-wrap: wrap;
      }

      .filters-section:has(.filters-main-bar:only-child) {
        display: none;
      }

      .filters-primary {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        flex: 1;
        min-width: 300px;
      }

      .filter-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .filter-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .filter-input-wrapper,
      .filter-select-wrapper,
      .filter-date-wrapper {
        display: flex;
        align-items: center;
      }

      .filter-input,
      .filter-select,
      .filter-date {
        border: 1px solid var(--border);
        padding: 3px;
        border-radius: 6px;
        background-color: var(--surface-lowest);
        color: var(--text-primary);
        font-size: 0.875rem;
        transition: all 0.2s ease;
        min-width: 140px;
        max-height: 36px;
      }

      .filter-input:focus,
      .filter-select:focus,
      .filter-date:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(242, 101, 34, 0.1);
      }

      .filter-select-wrapper mat-form-field {
        min-width: 160px;
        --mat-form-field-container-height: 36px;
      }

      .filter-select-wrapper ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }

      .filter-select-wrapper ::ng-deep .mat-mdc-text-field-wrapper {
        --mdc-filled-text-field-container-color: var(--surface-lowest);
        --mdc-filled-text-field-label-text-color: var(--text-secondary);
        --mdc-filled-text-field-input-text-color: var(--text-primary);
        --mat-form-field-state-layer-bg: var(--surface-lowest);
        background-color: var(--surface-lowest);
        border-radius: 6px;
      }

      .filter-select-wrapper ::ng-deep .mat-mdc-form-field-flex {
        height: 36px;
        padding: 0 8px;
      }

      .filter-select-wrapper ::ng-deep .mat-mdc-select-value-text {
        color: var(--text-primary);
      }

      .filter-select-wrapper ::ng-deep .mat-mdc-select-arrow {
        color: var(--primary);
      }

      [data-theme='dark'] .filter-select-wrapper ::ng-deep .mat-mdc-text-field-wrapper {
        background-color: var(--surface);
      }

      .filters-actions {
        display: flex;
        gap: 0.5rem;
      }

      .btn-advanced-filters {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background-color: var(--surface-lowest);
        border: 1px solid var(--border);
        border-radius: 6px;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s ease;
        height: 36px;
      }

      .btn-advanced-filters:hover,
      .btn-advanced-filters.active {
        background-color: var(--hover-bg);
        border-color: var(--primary);
        color: var(--primary);
      }

      .btn-advanced-filters svg {
        width: 16px;
        height: 16px;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 20px;
        height: 20px;
        padding: 0 0.35rem;
        background-color: var(--primary);
        color: white;
        border-radius: 10px;
        font-size: 0.75rem;
        font-weight: 700;
      }

      .filters-advanced-panel {
        padding: 1rem;
        background-color: var(--surface-low);
        border-top: 1px solid var(--border);
        animation: slideDown 0.2s ease;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .advanced-filters-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 1rem;
      }

      .filters-active {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 1rem;
        background-color: var(--surface-low);
        border-top: 1px solid var(--border);
      }

      .filters-chips {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        flex: 1;
      }

      .filter-chip {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.35rem 0.65rem;
        background-color: rgba(242, 101, 34, 0.1);
        border: 1px solid rgba(242, 101, 34, 0.3);
        border-radius: 16px;
        font-size: 0.8rem;
      }

      .chip-label {
        color: var(--text-primary);
        font-weight: 500;
      }

      .chip-remove {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        padding: 0;
        background: none;
        border: none;
        color: var(--primary);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .chip-remove:hover {
        transform: scale(1.2);
      }

      .chip-remove svg {
        width: 14px;
        height: 14px;
      }

      .btn-clear-all {
        padding: 0.35rem 0.75rem;
        background-color: var(--surface-lowest);
        border: 1px solid var(--border);
        border-radius: 6px;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 0.8rem;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .btn-clear-all:hover {
        background-color: var(--hover-bg);
        border-color: var(--primary);
        color: var(--primary);
      }

      .filters-loading {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        background-color: rgba(242, 101, 34, 0.05);
        border-top: 1px solid var(--border);
        font-size: 0.8rem;
        color: var(--primary);
      }

      .spinner {
        width: 14px;
        height: 14px;
        border: 2px solid rgba(242, 101, 34, 0.2);
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .filters-results {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
        color: var(--text-secondary);
        border-top: 1px solid var(--border);
      }

      [data-theme='dark'] .filter-input,
      [data-theme='dark'] .filter-select,
      [data-theme='dark'] .filter-date {
        background-color: var(--surface);
        color: var(--text-primary);
      }

      [data-theme='dark'] .filter-select-wrapper ::ng-deep .mat-mdc-text-field-wrapper {
        background-color: var(--surface);
      }

      @media (max-width: 768px) {
        .filters-main-bar {
          flex-direction: column;
        }

        .advanced-filters-grid {
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        }
      }
    `,
  ],
})
export class FiltersComponent implements OnInit {
  filters: FilterOption[] = [];
  primaryFilters: FilterOption[] = [];
  secondaryFilters: FilterOption[] = [];
  filterValues: { [key: string]: string } = {};
  activeFilters: ActiveFilter[] = [];
  showAdvancedFilters = false;
  isLoading = false;
  filteredResults = 0;
  totalResults = 100; // Este valor debería venir de la vista
  private currentView = 'dashboard';

  @Input() hidePrimary = false;

  // Opciones dinámicas para filtros dependientes
  ciudadesOptions: Array<{ value: string; label: string }> = [];
  comunasOptions: Array<{ value: string; label: string }> = [];

  constructor(
    private filterService: FilterService,
    private chileLocations: ChileLocationsService
  ) {}

  ngOnInit(): void {
    this.filterService.activeView$.subscribe((view) => {
      this.currentView = view;
      this.filters = this.filterService.getFiltersForView(view);
      this.categorizeFilters();
      this.filterValues = {};
      this.activeFilters = [];
      this.showAdvancedFilters = false;
      // Resetear opciones dinámicas
      this.ciudadesOptions = this.chileLocations.getCiudadesSelect();
      this.comunasOptions = this.chileLocations.getComunasSelect();
    });

    this.filterService.filters$.subscribe(() => {
      this.updateActiveFilters();
      this.updateDependentFilters();
    });

    this.filterService.results$.subscribe((results) => {
      this.filteredResults = results.filtered;
      this.totalResults = results.total;
    });
  }

  // Actualiza ciudad/comuna cuando cambia la región
  onRegionChange(): void {
    const regionId = this.filterValues['region'];
    if (regionId) {
      this.ciudadesOptions = this.chileLocations.getCiudadesSelect(regionId);
      this.comunasOptions = this.chileLocations.getComunasSelect(regionId);
      // Limpiar ciudad y comuna si cambió la región
      if (this.filterValues['city']) this.filterValues['city'] = '';
      if (this.filterValues['commune']) this.filterValues['commune'] = '';
    } else {
      this.ciudadesOptions = this.chileLocations.getCiudadesSelect();
      this.comunasOptions = this.chileLocations.getComunasSelect();
    }
    this.applyFilters();
  }

  private categorizeFilters(): void {
    // Primeros 1-2 filtros como principales, el resto como secundarios
    const mainFilterCount = Math.min(2, this.filters.length);
    this.primaryFilters = this.filters.slice(0, mainFilterCount);
    this.secondaryFilters = this.filters.slice(mainFilterCount);
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  applyFilters(): void {
    this.isLoading = true;
    this.updateActiveFilters();

    const activeFilters = Object.entries(this.filterValues)
      .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      .reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as { [key: string]: string },
      );

    this.filterService.updateFilters(activeFilters);

    // Simular carga
    setTimeout(() => {
      this.isLoading = false;
      this.filteredResults = Math.max(
        0,
        this.totalResults - Object.keys(activeFilters).length * 10,
      );
    }, 500);
  }

  private updateActiveFilters(): void {
    this.activeFilters = Object.entries(this.filterValues)
      .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      .map(([key, value]) => {
        const filter = this.filters.find((f) => f.key === key);
        const optionLabel = filter?.options?.find((o) => o.value === value)?.label || value;
        return {
          key,
          label: filter?.label || key,
          value: optionLabel,
          displayLabel: filter?.label || key,
        };
      });
  }

  removeFilter(key: string): void {
    this.filterValues[key] = '';
    this.applyFilters();
  }

  clearFilters(): void {
    this.filterValues = {};
    this.filterService.updateFilters({});
    this.activeFilters = [];
    this.isLoading = false;
  }

  getSecondaryActiveCount(): number {
    return this.secondaryFilters.filter(
      (f) =>
        this.filterValues[f.key] !== '' &&
        this.filterValues[f.key] !== null &&
        this.filterValues[f.key] !== undefined,
    ).length;
  }

  hasActiveFilters(): boolean {
    return Object.values(this.filterValues).some((v) => v !== '' && v !== null && v !== undefined);
  }

  private updateDependentFilters(): void {
    const regionId = this.filterValues['region'];
    if (regionId) {
      this.ciudadesOptions = this.chileLocations.getCiudadesSelect(regionId);
      this.comunasOptions = this.chileLocations.getComunasSelect(regionId);
    } else {
      this.ciudadesOptions = this.chileLocations.getCiudadesSelect();
      this.comunasOptions = this.chileLocations.getComunasSelect();
    }
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
}
