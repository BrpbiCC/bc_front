import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
  usuario = '';
  password = '';
  logoLight = '/imagenes/logos/FrioCheck.svg';
  logoDark = '/imagenes/logos/FrioCheckDark.svg';

  // Theme management
  isDarkTheme = false;

  // Modal de recuperación
  showForgotModal = false;
  forgotEmail = '';
  forgotIsLoading = false;
  forgotSuccessMessage = '';
  forgotErrorMessage = '';
  forgotRecoverySent = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadSavedTheme();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  private loadSavedTheme() {
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

  onLogin() {
    this.router.navigate(['/dashboard']);
  }

  openForgotModal() {
    this.showForgotModal = true;
    this.forgotEmail = '';
    this.forgotSuccessMessage = '';
    this.forgotErrorMessage = '';
    this.forgotRecoverySent = false;
  }

  closeForgotModal() {
    this.showForgotModal = false;
    this.forgotRecoverySent = false;
  }

  onSendRecovery() {
    this.forgotIsLoading = true;
    this.forgotSuccessMessage = '';
    this.forgotErrorMessage = '';

    // Simular envío de recuperación
    setTimeout(() => {
      // Simular éxito
      this.forgotSuccessMessage = 'Tu solicitud de recuperación fue enviada correctamente.';
      this.forgotRecoverySent = true;
      this.forgotIsLoading = false;

      // Cerrar automáticamente después de 2 segundos si fue exitoso
      setTimeout(() => {
        this.closeForgotModal();
      }, 2000);

      // Para simular error:
      // this.forgotErrorMessage = 'Usuario no encontrado. Verifica tu correo o usuario.';
      // this.forgotIsLoading = false;
    }, 1500);
  }
}
