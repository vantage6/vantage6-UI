import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MFAResetTokenForm } from 'src/app/models/forms/login-form.model';
import { routePaths } from 'src/app/routes';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mfa-recover',
  templateUrl: './mfa-recover.component.html',
  styleUrls: ['./mfa-recover.component.scss']
})
export class MfaRecoverComponent {
  recoverForm = this.fb.nonNullable.group({
    resetToken: ['', Validators.required]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  async onSubmit(): Promise<void> {
    if (!this.recoverForm.valid) return;

    const success = await this.authService.MFARecover(this.recoverForm.value as MFAResetTokenForm);
    if (success) {
      this.router.navigate([routePaths.setupMFA]);
    }
  }
}
