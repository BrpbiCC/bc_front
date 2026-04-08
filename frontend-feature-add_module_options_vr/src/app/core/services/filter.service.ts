import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChileLocationsService } from './chile-locations.service';

export interface FilterOption {
  label: string;
  key: string;
  type: 'select' | 'input' | 'date' | 'multiselect';
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  isPrimary?: boolean;
  join?: 'AND' | 'OR';
}

export interface FilterConfig {
  [viewName: string]: FilterOption[];
}

export interface FilterResults {
  filtered: number;
  total: number;
}

export interface ViewRoute {
  route: string;
  label: string;
  icon: string;
}

const VIEW_ROUTES: ViewRoute[] = [
  { route: '/dashboard', label: 'Panel', icon: 'home' },
  { route: '/tickets', label: 'Tickets', icon: 'alert-circle' },
  { route: '/visitas', label: 'Visitas', icon: 'map-pin' },
  { route: '/activos', label: 'Activos NFC', icon: 'layers' },
  { route: '/reportes', label: 'Reportes', icon: 'bar-chart' },
  { route: '/usuarios', label: 'Usuarios', icon: 'users' },
  { route: '/perfil', label: 'Mi Perfil', icon: 'user' },
  { route: '/pedidos', label: 'Pedidos', icon: 'package' },
  { route: '/locales', label: 'Locales', icon: 'store' },
  { route: '/configuracion', label: 'Configuración', icon: 'settings' },
];

const VIEW_NAME_MAP: { [route: string]: string } = {
  '/dashboard': 'dashboard',
  '/tickets': 'tickets',
  '/visitas': 'visitas',
  '/activos': 'activos',
  '/reportes': 'reportes',
  '/usuarios': 'usuarios',
  '/perfil': 'perfil',
  '/pedidos': 'pedidos',
  '/locales': 'locales',
};

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private filterConfigMap: FilterConfig = {};
  private historyKey = 'visitedViews';
  private visitedViewsSubject = new BehaviorSubject<string[]>([]);
  public visitedViews$ = this.visitedViewsSubject.asObservable();

  private carouselIndexKey = 'viewCarouselIndex';
  private carouselIndexSubject = new BehaviorSubject<number>(0);
  public carouselIndex$ = this.carouselIndexSubject.asObservable();

  private userRole: string | null = null;

  constructor(private chileLocations: ChileLocationsService) {
    this.initializeFilterConfig();
    this.loadVisitedViews();
    this.loadUserRole();
  }

  private loadUserRole(): void {
    const role = localStorage.getItem('userRole');
    this.userRole = role;
  }

  setUserRole(role: string): void {
    this.userRole = role;
  }

  getViewRoute(viewName: string): ViewRoute | undefined {
    return VIEW_ROUTES.find((v) => v.route === viewName || VIEW_NAME_MAP[v.route] === viewName);
  }

  getRouteFromViewName(viewName: string): string | undefined {
    const route = VIEW_ROUTES.find((v) => VIEW_NAME_MAP[v.route] === viewName);
    return route?.route;
  }

  getCarouselViews(): ViewRoute[] {
    const visited = this.visitedViewsSubject.value;
    const ordered = this.orderBySidebarOrder(visited);
    const index = this.carouselIndexSubject.value;
    const visibleViews = ordered.slice(index, index + 3);
    return visibleViews
      .map((viewName) => this.getViewRoute(viewName))
      .filter((v): v is ViewRoute => v !== undefined);
  }

  private orderBySidebarOrder(views: string[]): string[] {
    const adminOrder = ['dashboard', 'activos', 'visitas', 'tickets', 'pedidos', 'locales', 'usuarios', 'reportes', 'configuracion', 'perfil'];
    const soporteOrder = ['dashboard', 'tickets', 'visitas', 'activos', 'reportes', 'usuarios', 'perfil'];
    
    const sidebarOrder = this.userRole === 'admin' ? adminOrder : soporteOrder;
    
    return views
      .filter(v => sidebarOrder.includes(v))
      .map(v => ({ name: v, order: sidebarOrder.indexOf(v) }))
      .sort((a, b) => a.order - b.order)
      .map(v => v.name);
  }

  getCarouselIndex(): number {
    return this.carouselIndexSubject.value;
  }

  syncCarouselToView(viewName: string): void {
    const ordered = this.orderBySidebarOrder(this.visitedViewsSubject.value);
    const viewIndex = ordered.indexOf(viewName);
    
    if (viewIndex === -1) return;
    
    const newCarouselIndex = Math.floor(viewIndex / 3) * 3;
    
    if (newCarouselIndex !== this.carouselIndexSubject.value) {
      this.carouselIndexSubject.next(newCarouselIndex);
      localStorage.setItem(this.carouselIndexKey, JSON.stringify(newCarouselIndex));
    }
  }

  canGoNext(): boolean {
    const visited = this.visitedViewsSubject.value;
    const ordered = this.orderBySidebarOrder(visited);
    const index = this.carouselIndexSubject.value;
    return index + 3 < ordered.length;
  }

  canGoPrev(): boolean {
    return this.carouselIndexSubject.value > 0;
  }

  nextCarousel(): void {
    if (this.canGoNext()) {
      const newIndex = this.carouselIndexSubject.value + 3;
      this.carouselIndexSubject.next(newIndex);
      localStorage.setItem(this.carouselIndexKey, JSON.stringify(newIndex));
    }
  }

  prevCarousel(): void {
    if (this.canGoPrev()) {
      const newIndex = Math.max(0, this.carouselIndexSubject.value - 3);
      this.carouselIndexSubject.next(newIndex);
      localStorage.setItem(this.carouselIndexKey, JSON.stringify(newIndex));
    }
  }

  addToHistory(viewName: string): void {
    let visited = this.visitedViewsSubject.value.filter((v) => v !== viewName);
    visited.push(viewName);
    
    const ordered = this.orderBySidebarOrder(visited);
    
    this.visitedViewsSubject.next(ordered);
    localStorage.setItem(this.historyKey, JSON.stringify(ordered));
  }

  private loadVisitedViews(): void {
    const stored = localStorage.getItem(this.historyKey);
    if (stored) {
      try {
        this.visitedViewsSubject.next(JSON.parse(stored));
      } catch {
        this.visitedViewsSubject.next([]);
      }
    }
    const indexStored = localStorage.getItem(this.carouselIndexKey);
    if (indexStored) {
      try {
        this.carouselIndexSubject.next(JSON.parse(indexStored));
      } catch {
        this.carouselIndexSubject.next(0);
      }
    }
  }

  private initializeFilterConfig(): void {
    const regionesOptions = this.chileLocations.getRegionesSelect();
    const comunasOptions = this.chileLocations.getComunasSelect();

    this.filterConfigMap = {
      none: [],
      tickets: [
        {
          label: 'Generador',
          key: 'generator',
          type: 'select',
          placeholder: 'Selecciona quién genera',
          isPrimary: true,
          options: [
            { value: 'admin', label: 'Administrador' },
            { value: 'soporte', label: 'Soporte' },
            { value: 'cliente', label: 'Cliente' },
          ],
        },
        {
          label: 'Estado',
          key: 'status',
          type: 'select',
          placeholder: 'Selecciona estado',
          isPrimary: true,
          options: [
            { value: 'sin-resolver', label: 'Sin resolver' },
            { value: 'en-proceso', label: 'En proceso' },
            { value: 'resuelto', label: 'Resuelto' },
          ],
        },
        {
          label: 'Región',
          key: 'region',
          type: 'select',
          placeholder: 'Selecciona región',
          options: regionesOptions,
        },
        {
          label: 'Ciudad',
          key: 'city',
          type: 'select',
          placeholder: 'Selecciona ciudad',
          options: this.chileLocations.getCiudadesSelect(),
        },
        {
          label: 'Comuna',
          key: 'commune',
          type: 'select',
          placeholder: 'Selecciona comuna',
          options: comunasOptions,
        },
        {
          label: 'Prioridad',
          key: 'priority',
          type: 'select',
          placeholder: 'Selecciona prioridad',
          options: [
            { value: 'baja', label: 'Baja' },
            { value: 'media', label: 'Media' },
            { value: 'alta', label: 'Alta' },
          ],
        },
      ],
      visitas: [
        {
          label: 'Rol',
          key: 'role',
          type: 'select',
          placeholder: 'Selecciona rol',
          isPrimary: true,
          options: [
            { value: 'tecnico', label: 'Técnico' },
            { value: 'vendedor', label: 'Vendedor' },
            { value: 'reparto', label: 'Reparto' },
          ],
        },
        {
          label: 'Fecha',
          key: 'date',
          type: 'date',
          isPrimary: true,
          placeholder: 'Selecciona fecha',
        },
        {
          label: 'Región',
          key: 'region',
          type: 'select',
          placeholder: 'Selecciona región',
          options: regionesOptions,
        },
        {
          label: 'Comuna',
          key: 'commune',
          type: 'select',
          placeholder: 'Selecciona comuna',
          options: comunasOptions,
        },
      ],
      activos: [
        {
          label: 'Estado',
          key: 'status',
          type: 'select',
          placeholder: 'Selecciona estado',
          isPrimary: true,
          options: [
            { value: 'activo', label: 'Activo' },
            { value: 'inactivo', label: 'Inactivo' },
            { value: 'mantenimiento', label: 'Mantenimiento' },
          ],
        },
        {
          label: 'Sector',
          key: 'sector',
          type: 'select',
          placeholder: 'Selecciona sector',
          options: [
            { value: 'retail', label: 'Retail' },
            { value: 'industrial', label: 'Industrial' },
            { value: 'restaurantes', label: 'Restaurantes' },
          ],
        },
        {
          label: 'Región',
          key: 'region',
          type: 'select',
          placeholder: 'Selecciona región',
          options: regionesOptions,
        },
        {
          label: 'Comuna',
          key: 'commune',
          type: 'select',
          placeholder: 'Selecciona comuna',
          options: comunasOptions,
        },
      ],
      pedidos: [
        {
          label: 'Estado',
          key: 'status',
          type: 'select',
          placeholder: 'Selecciona estado',
          isPrimary: true,
          options: [
            { value: 'pendiente', label: 'Pendiente' },
            { value: 'en-proceso', label: 'En Proceso' },
            { value: 'entregado', label: 'Entregado' },
            { value: 'cancelado', label: 'Cancelado' },
          ],
        },
        {
          label: 'Tipo',
          key: 'type',
          type: 'select',
          placeholder: 'Selecciona tipo',
          options: [
            { value: 'compra', label: 'Compra' },
            { value: 'venta', label: 'Venta' },
            { value: 'servicio', label: 'Servicio' },
          ],
        },
        {
          label: 'Región',
          key: 'region',
          type: 'select',
          placeholder: 'Selecciona región',
          options: regionesOptions,
        },
        {
          label: 'Fecha',
          key: 'date',
          type: 'date',
          placeholder: 'Selecciona fecha',
        },
      ],
      usuarios: [
        {
          label: 'Rol',
          key: 'role',
          type: 'select',
          placeholder: 'Selecciona rol',
          isPrimary: true,
          options: [
            { value: 'admin', label: 'Administrador' },
            { value: 'soporte', label: 'Soporte' },
            { value: 'tecnico', label: 'Técnico' },
            { value: 'vendedor', label: 'Vendedor' },
          ],
        },
        {
          label: 'Estado',
          key: 'status',
          type: 'select',
          placeholder: 'Selecciona estado',
          options: [
            { value: 'activo', label: 'Activo' },
            { value: 'inactivo', label: 'Inactivo' },
          ],
        },
        {
          label: 'Región',
          key: 'region',
          type: 'select',
          placeholder: 'Selecciona región',
          options: regionesOptions,
        },
      ],
      reportes: [
        {
          label: 'Tipo',
          key: 'type',
          type: 'select',
          placeholder: 'Selecciona tipo',
          isPrimary: true,
          options: [
            { value: 'tickets', label: 'Tickets' },
            { value: 'visitas', label: 'Visitas' },
            { value: 'activos', label: 'Activos' },
            { value: 'pedidos', label: 'Pedidos' },
          ],
        },
        {
          label: 'Fecha Inicio',
          key: 'startDate',
          type: 'date',
          placeholder: 'Fecha inicio',
        },
        {
          label: 'Fecha Fin',
          key: 'endDate',
          type: 'date',
          placeholder: 'Fecha fin',
        },
        {
          label: 'Región',
          key: 'region',
          type: 'select',
          placeholder: 'Selecciona región',
          options: regionesOptions,
        },
      ],
    };
  }

  private filtersSubject = new BehaviorSubject<{ [key: string]: string }>({});
  public filters$ = this.filtersSubject.asObservable();

  private activeViewSubject = new BehaviorSubject<string>('dashboard');
  public activeView$ = this.activeViewSubject.asObservable();

  private resultsSubject = new BehaviorSubject<FilterResults>({ filtered: 100, total: 100 });
  public results$ = this.resultsSubject.asObservable();

  setActiveView(viewName: string): void {
    this.addToHistory(viewName);
    this.activeViewSubject.next(viewName);
    this.filtersSubject.next({});
    this.resultsSubject.next({ filtered: 100, total: 100 });
  }

  getFiltersForView(viewName: string): FilterOption[] {
    return this.filterConfigMap[viewName] || [];
  }

  updateFilters(filters: { [key: string]: string }): void {
    this.filtersSubject.next(filters);
    // Simular cálculo de resultados basado en filtros
    const filterCount = Object.values(filters).filter(
      (v) => v !== '' && v !== null && v !== undefined,
    ).length;
    const baseTotal = 100;
    const filtered = Math.max(10, baseTotal - filterCount * 15);
    this.resultsSubject.next({ filtered, total: baseTotal });
  }

  getActiveView(): string {
    return this.activeViewSubject.value;
  }

  getFilters(): { [key: string]: string } {
    return this.filtersSubject.value;
  }

  getResults(): FilterResults {
    return this.resultsSubject.value;
  }
}
