import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViewHistoryService {
  private historyKey = 'viewHistory';
  private maxItems = 3;
  private historySubject = new BehaviorSubject<string[]>([]);
  public history$ = this.historySubject.asObservable();

  constructor() {
    this.loadHistory();
  }

  addView(viewName: string): void {
    let history = this.getHistory();

    history = history.filter((v) => v !== viewName);

    history.unshift(viewName);

    if (history.length > this.maxItems) {
      history = history.slice(0, this.maxItems);
    }

    this.saveHistory(history);
    this.historySubject.next(history);
  }

  getHistory(): string[] {
    return this.historySubject.value;
  }

  private loadHistory(): void {
    const stored = localStorage.getItem(this.historyKey);
    if (stored) {
      try {
        const history = JSON.parse(stored);
        this.historySubject.next(history);
      } catch {
        this.historySubject.next([]);
      }
    }
  }

  private saveHistory(history: string[]): void {
    localStorage.setItem(this.historyKey, JSON.stringify(history));
    this.historySubject.next(history);
  }
}
