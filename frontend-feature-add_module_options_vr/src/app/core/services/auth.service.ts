import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type UserRole = 'admin' | 'soporte' | 'super-admin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private roleSubject = new BehaviorSubject<UserRole | null>(this.getRoleFromStorage());
  public role$ = this.roleSubject.asObservable();

  constructor() {}

  setRole(role: UserRole): void {
    localStorage.setItem('userRole', role);
    this.roleSubject.next(role);
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
