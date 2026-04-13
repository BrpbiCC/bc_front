import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * User roles from backend:
 * - ADMIN: Full access, can manage all locales and users
 * - SUPPORT: Technical support access
 * - SUPER_ADMIN: System administrator (excluded from map access)
 */
export type UserRole = 'admin' | 'support' | 'super-admin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private roleSubject = new BehaviorSubject<UserRole | null>(this.getRoleFromStorage());
  public role$ = this.roleSubject.asObservable();

  // Map backend roles to frontend roles
  private roleMap: Record<string, UserRole> = {
    'ADMIN': 'admin',
    'SUPPORT': 'support',
    'SUPER_ADMIN': 'super-admin'
  };

  constructor() {}

  setRole(backendRole: string): void {
    const frontendRole = this.roleMap[backendRole] || (backendRole.toLowerCase() as UserRole);
    localStorage.setItem('userRole', frontendRole);
    this.roleSubject.next(frontendRole);
  }

  getRole(): UserRole | null {
    return this.roleSubject.value;
  }

  logout(): void {
    localStorage.removeItem('userRole');
    this.roleSubject.next(null);
  }

  private getRoleFromStorage(): UserRole | null {
    const role = localStorage.getItem('userRole');
    return (role as UserRole) || null;
  }
}
