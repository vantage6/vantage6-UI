import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { SearchRequest } from 'src/app/components/table/table.component';
import { getApiSearchParameters } from 'src/app/helpers/api.helper';
import { unlikeApiParameter } from 'src/app/helpers/general.helper';
import { PaginationLinks } from 'src/app/models/api/pagination.model';
import { OperationType, ResourceType, ScopeType } from 'src/app/models/api/rule.model';
import { GetUserParameters, UserSortProperties } from 'src/app/models/api/user.model';
import { TableData } from 'src/app/models/application/table.model';
import { routePaths } from 'src/app/routes';
import { PermissionService } from 'src/app/services/permission.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'card-container';

  destroy$ = new Subject();
  routes = routePaths;

  isLoading: boolean = true;
  canCreate: boolean = false;
  table?: TableData;
  pagination: PaginationLinks | null = null;
  currentPage: number = 1;

  getUserParameters: GetUserParameters = {};

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private userService: UserService,
    private permissionService: PermissionService
  ) {}

  async ngOnInit(): Promise<void> {
    this.setPermissions();
    await this.initData(this.currentPage, this.getUserParameters);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  async handlePageEvent(e: PageEvent) {
    await this.getUsers(e.pageIndex + 1, this.getUserParameters);
  }

  handleTableClick(id: string) {
    this.router.navigate([routePaths.user, id]);
  }

  private async initData(page: number, parameters: GetUserParameters) {
    this.isLoading = true;
    this.currentPage = page;
    this.getUserParameters = parameters;
    await this.getUsers(page, parameters);
    this.isLoading = false;
  }

  private async getUsers(page: number, getUserParameters: GetUserParameters) {
    const result = await this.userService.getPaginatedUsers(page, { ...getUserParameters, sort: UserSortProperties.Username });
    this.table = {
      columns: [
        { id: 'id', label: this.translateService.instant('general.id') },
        {
          id: 'username',
          label: this.translateService.instant('user.username'),
          searchEnabled: true,
          initSearchString: unlikeApiParameter(getUserParameters.username)
        },
        {
          id: 'firstname',
          label: this.translateService.instant('user.first-name'),
          searchEnabled: true,
          initSearchString: unlikeApiParameter(getUserParameters.firstname)
        },
        {
          id: 'lastname',
          label: this.translateService.instant('user.last-name'),
          searchEnabled: true,
          initSearchString: unlikeApiParameter(getUserParameters.lastname)
        },
        {
          id: 'email',
          label: this.translateService.instant('user.email'),
          searchEnabled: true,
          initSearchString: unlikeApiParameter(getUserParameters.email)
        }
      ],
      rows: result.data.map((_) => ({
        id: _.id.toString(),
        columnData: {
          id: _.id,
          username: _.username,
          firstname: _.firstname,
          lastname: _.lastname,
          email: _.email
        }
      }))
    };
    this.pagination = result.links;
  }

  handleSearchChanged(searchRequests: SearchRequest[]): void {
    const parameters = getApiSearchParameters<GetUserParameters>(searchRequests);
    this.initData(1, parameters);
  }

  private setPermissions() {
    this.permissionService
      .isInitialized()
      .pipe(takeUntil(this.destroy$))
      .subscribe((initialized) => {
        if (initialized) {
          this.canCreate = this.permissionService.isAllowed(ScopeType.ANY, ResourceType.USER, OperationType.CREATE);
        }
      });
  }
}
