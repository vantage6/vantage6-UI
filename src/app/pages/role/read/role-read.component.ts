import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Organization } from 'src/app/models/api/organization.model';
import { Role, RoleLazyProperties } from 'src/app/models/api/role.model';
import { OperationType, ResourceType, Rule, ScopeType } from 'src/app/models/api/rule.model';
import { TableData } from 'src/app/models/application/table.model';
import { OrganizationService } from 'src/app/services/organization.service';
import { PermissionService } from 'src/app/services/permission.service';
import { RoleService } from 'src/app/services/role.service';
import { RuleService } from 'src/app/services/rule.service';

@Component({
  selector: 'app-role-read',
  templateUrl: './role-read.component.html',
  styleUrls: ['./role-read.component.scss']
})
export class RoleReadComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'card-container';
  @Input() id = '';
  destroy$ = new Subject();

  canEdit = false;
  isLoading = true;
  isEditing: boolean = false;

  role?: Role;
  roleRules: Rule[] = [];
  roleOrganization?: Organization;
  allRules: Rule[] = [];
  userTable?: TableData;

  /* Bound variables to permission matrix. */
  preselectedRules: Rule[] = [];
  selectableRules: Rule[] = [];
  fixedSelectedRules: Rule[] = [];

  changedRules?: Rule[];
  errorMessage?: string;

  constructor(
    private roleService: RoleService,
    private ruleService: RuleService,
    private organizationService: OrganizationService,
    private translateService: TranslateService,
    private permissionService: PermissionService
  ) {}

  async ngOnInit(): Promise<void> {
    this.setPermissions();
    this.allRules = await this.ruleService.getAllRules();
    try {
      await this.initData();
    } catch (error) {
      this.handleHttpError(error as HttpErrorResponse);
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  private handleHttpError(error: HttpErrorResponse): void {
    this.errorMessage = error.error['msg'] ?? error.message;
  }

  private async initData(): Promise<void> {
    this.role = await this.roleService.getRole(this.id, [RoleLazyProperties.Users]);
    const organizationId = this.role.organization?.id.toString();
    if (organizationId) {
      this.roleOrganization = await this.organizationService.getOrganization(organizationId as string);
    }
    this.userTable = {
      columns: [
        { id: 'username', label: this.translateService.instant('user.username') },
        { id: 'firstname', label: this.translateService.instant('user.first-name') },
        { id: 'lastname', label: this.translateService.instant('user.last-name') },
        { id: 'email', label: this.translateService.instant('user.email') }
      ],
      rows: this.role.users.map((user) => ({
        id: user.id.toString(),
        columnData: { ...user }
      }))
    };
    this.roleRules = await this.ruleService.getAllRules(this.id);
    this.enterEditMode(false);
    this.isLoading = false;
  }

  private enterEditMode(edit: boolean): void {
    this.isEditing = edit;
    if (edit) {
      this.preselectedRules = this.roleRules;
      this.fixedSelectedRules = [];
      this.selectableRules = this.allRules;
    } else {
      this.preselectedRules = [];
      this.fixedSelectedRules = this.roleRules;
      this.selectableRules = this.roleRules;
    }
  }

  public handleEnterEditMode(): void {
    this.enterEditMode(true);
  }

  public handleCancelEdit(): void {
    this.enterEditMode(false);
  }

  public get showData(): boolean {
    return !this.isLoading && this.role != undefined;
  }

  public get showUserTable(): boolean {
    return this.userTable != undefined && this.userTable.rows.length > 0;
  }

  public handleChangedSelection(rules: Rule[]): void {
    this.changedRules = rules;
  }

  // TODO: handle error
  public async handleSubmitEdit(): Promise<void> {
    if (!this.role || !this.changedRules) return;

    this.isLoading = true;
    const role: Role = { ...this.role, rules: this.changedRules };
    await this.roleService.patchRole(role);
    this.changedRules = [];
    this.initData();
  }

  public get editEnabled(): boolean {
    return this.canEdit && !this.role?.is_default_role;
  }

  public get submitDisabled(): boolean {
    return this.changedRules?.length === 0;
  }

  getDefaultRoleLabel(): string {
    if (!this.role) return '';
    return this.role.is_default_role ? this.translateService.instant('general.yes') : this.translateService.instant('general.no');
  }

  private setPermissions() {
    this.permissionService
      .isInitialized()
      .pipe(takeUntil(this.destroy$))
      .subscribe((initialized) => {
        if (initialized) {
          this.canEdit = this.permissionService.isAllowed(ScopeType.ANY, ResourceType.ROLE, OperationType.EDIT);
        }
      });
  }
}
