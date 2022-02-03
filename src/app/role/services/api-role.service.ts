import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Role } from 'src/app/role/interfaces/role';
import { Rule } from 'src/app/rule/interfaces/rule';

import { getIdsFromArray } from 'src/app/shared/utils';
import { environment } from 'src/environments/environment';
import { ConvertJsonService } from 'src/app/shared/services/convert-json.service';
import { ApiRuleService } from 'src/app/rule/services/api-rule.service';

@Injectable({
  providedIn: 'root',
})
export class ApiRoleService {
  all_rules: Rule[] = [];

  constructor(
    private http: HttpClient,
    private ruleService: ApiRuleService,
    private convertJsonService: ConvertJsonService
  ) {
    this.setup();
  }

  async setup(): Promise<void> {
    this.all_rules = await this.ruleService.getAllRules();
  }

  list(
    organization_id: number | null = null,
    include_root: boolean = false
  ): any {
    let params: any = {};
    if (organization_id !== null) {
      params['organization_id'] = organization_id;
    }
    params['include_root'] = include_root;
    return this.http.get(environment.api_url + '/role', { params: params });
  }

  get(id: number) {
    return this.http.get<any>(environment.api_url + '/role/' + id);
  }

  update(role: Role) {
    const data = this._get_data(role);
    return this.http.patch<any>(environment.api_url + '/role/' + role.id, data);
  }

  create(role: Role) {
    const data = this._get_data(role);
    return this.http.post<any>(environment.api_url + '/role', data);
  }

  delete(role: Role) {
    return this.http.delete<any>(environment.api_url + '/role/' + role.id);
  }

  private _get_data(role: Role): any {
    return {
      name: role.name,
      description: role.description,
      organization_id: role.organization_id,
      rules: getIdsFromArray(role.rules),
    };
  }

  async getRole(id: number): Promise<Role> {
    if (this.all_rules.length === 0) {
      await this.setup();
    }
    let role_json = await this.get(id).toPromise();
    return this.convertJsonService.getRole(role_json, this.all_rules);
  }

  async getRoles(ids: number[]): Promise<Role[]> {
    let roles: Role[] = [];
    for (let id of ids) {
      roles.push(await this.getRole(id));
    }
    return roles;
  }

  async getOrganizationRoles(
    org_id: number,
    include_root: boolean = false
  ): Promise<Role[]> {
    let role_json = await this.list(org_id, include_root).toPromise();
    let roles: Role[] = [];
    for (let role of role_json) {
      roles.push(this.convertJsonService.getRole(role, this.all_rules));
    }
    return roles;
  }
}