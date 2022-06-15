import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiNodeService } from 'src/app/services/api/api-node.service';
import { ConvertJsonService } from 'src/app/services/common/convert-json.service';
import { BaseDataService } from 'src/app/services/data/base-data.service';
import { Node } from 'src/app/interfaces/node';

@Injectable({
  providedIn: 'root',
})
export class NodeDataService extends BaseDataService {
  collab_dict: { [collab_id: number]: Node[] } = {};

  constructor(
    protected apiService: ApiNodeService,
    protected convertJsonService: ConvertJsonService
  ) {
    super(apiService, convertJsonService);
  }

  async get(id: number, force_refresh: boolean = false): Promise<Node> {
    return (await super.get_base(
      id,
      this.convertJsonService.getNode,
      [],
      force_refresh
    )) as Node;
  }

  async list(force_refresh: boolean = false): Promise<Observable<Node[]>> {
    return (await super.list_base(
      this.convertJsonService.getNode,
      [],
      force_refresh
    )) as Observable<Node[]>;
  }

  async org_list(
    organization_id: number,
    force_refresh: boolean = false
  ): Promise<Node[]> {
    return (await super.org_list_base(
      organization_id,
      this.convertJsonService.getNode,
      [],
      force_refresh
    )) as Node[];
  }

  async collab_list(
    collaboration_id: number,
    force_refresh: boolean = false
  ): Promise<Node[]> {
    return (await super.collab_list_base(
      collaboration_id,
      this.convertJsonService.getNode,
      [],
      force_refresh
    )) as Node[];
  }
}