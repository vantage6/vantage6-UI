import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AccessGuard } from './access-guard.guard';
import { OrganizationComponent } from './organization/organization.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { RoleEditComponent } from './role/role-edit/role-edit.component';
import { OrganizationEditComponent } from './organization/organization-edit/organization-edit.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'organization',
    component: OrganizationComponent,
    data: {
      requiresLogin: true,
      permissionType: 'view',
      permissionResource: 'organization',
    },
    canActivate: [AccessGuard],
  },
  {
    path: 'user/edit',
    component: UserEditComponent,
    data: {
      requiresLogin: true,
      permissionType: 'edit',
      alternativePermissionType: 'create',
      permissionResource: 'user',
    },
    canActivate: [AccessGuard],
  },
  {
    path: 'organization/edit',
    component: OrganizationEditComponent,
    data: {
      requiresLogin: true,
      permissionType: 'edit',
      alternativePermissionType: 'create',
      permissionResource: 'organization',
    },
    canActivate: [AccessGuard],
  },
  {
    path: 'role/edit',
    component: RoleEditComponent,
    data: {
      requiresLogin: true,
      permissionType: 'edit',
      alternativePermissionType: 'create',
      permissionResource: 'role',
    },
    canActivate: [AccessGuard],
  },
];
//TODO add * path with 404 not found page

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
