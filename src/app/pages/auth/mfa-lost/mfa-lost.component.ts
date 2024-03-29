import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routePaths } from 'src/app/routes';
import { AuthService } from 'src/app/services/auth.service';
import { LoginErrorService } from 'src/app/services/login-error.service';

@Component({
  selector: 'app-mfa-lost',
  templateUrl: './mfa-lost.component.html',
  styleUrls: ['./mfa-lost.component.scss']
})
export class MfaLostComponent implements OnInit {
  executed_request = false;
  responseMsg = '';
  routes = routePaths;

  constructor(
    public loginErrorService: LoginErrorService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginErrorService.clearError();
    if (!this.authService.username || !this.authService.password) {
      this.router.navigate([routePaths.login]);
    }
  }

  async onSubmit(): Promise<void> {
    const responseMsg = await this.authService.MFALost();
    if (responseMsg) {
      this.executed_request = true;
      this.responseMsg = responseMsg;
    }
  }
}
