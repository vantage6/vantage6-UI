import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY_NODE, NodeWithOrg } from 'src/app/interfaces/node';
import { UtilsService } from 'src/app/services/common/utils.service';
import { CollabDataService } from 'src/app/services/data/collab-data.service';
import { NodeDataService } from 'src/app/services/data/node-data.service';
import { OrgDataService } from 'src/app/services/data/org-data.service';
import { ResType } from 'src/app/shared/enum';
import { environment } from 'src/environments/environment';
import { NodeConfig } from './node-config';

@Component({
  selector: 'app-node-create-config',
  templateUrl: './node-create-config.component.html',
  styleUrls: [
    '../../../shared/scss/buttons.scss',
    './node-create-config.component.scss',
  ],
})
export class NodeCreateConfigComponent implements OnInit {
  ENVS: string[] = ['application', 'prod', 'acc', 'test', 'dev'];
  LOG_LEVELS: string[] = [
    'debug',
    'info',
    'warning',
    'error',
    'critical',
    'notset',
  ];

  route_id: number | null = null;
  node: NodeWithOrg = EMPTY_NODE;

  config = new NodeConfig(
    '',
    this.ENVS[0],
    true,
    [{ label: 'default', path: '' }],
    this.LOG_LEVELS[0],
    false,
    '10.76.0.0/16',
    false,
    true,
    [{ algo_exp: '' }]
  );
  submitted = false;

  server_url = environment.server_url;
  server_port = environment.server_port;
  api_path = environment.api_path;

  constructor(
    private activatedRoute: ActivatedRoute,
    private nodeDataService: NodeDataService,
    private collabDataService: CollabDataService,
    private orgDataService: OrgDataService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.readRoute();
  }

  // TODO this code is very similar to that used in other places...
  readRoute(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.route_id = this.utilsService.getId(params, ResType.NODE);
      if (this.route_id === -1) {
        return; // cannot get route id
      }
      this.setup();
    });
  }

  async setup() {
    await this.setNode();
    await this.addCollabToNode();
    await this.addOrgToNode();
    if (this.node.collaboration && this.node.organization) {
      this.config.name =
        `${this.node.collaboration.name}_${this.node.organization.name}` +
        `_node_config`;
    }
    if (this.node.collaboration) {
      this.config.is_encrypted = this.node.collaboration.encrypted;
    }
  }

  async setNode(): Promise<void> {
    this.node = await this.nodeDataService.get(this.route_id as number);
  }

  async addCollabToNode() {
    this.node.collaboration = await this.collabDataService.get(
      this.node.collaboration_id
    );
  }

  async addOrgToNode() {
    this.node.organization = await this.orgDataService.get(
      this.node.organization_id
    );
  }

  selectEnv(env: string): void {
    this.config.environment = env;
  }

  selectLogLvl(lvl: string): void {
    this.config.log_level = lvl;
  }

  addDatabase(): void {
    this.config.databases.push({ label: '', path: '' });
  }

  addAlgorithm(): void {
    this.config.allowed_algorithms.push({ algo_exp: '' });
  }

  download() {
    this.submitted = true;
    console.log(this.config);
  }
  cancel() {}
}
