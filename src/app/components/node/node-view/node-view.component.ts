import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

import { EMPTY_NODE, Node } from 'src/app/interfaces/node';
import { ModalMessageComponent } from 'src/app/components/modal/modal-message/modal-message.component';
import { ExitMode, ResType } from 'src/app/shared/enum';

import { UserPermissionService } from 'src/app/auth/services/user-permission.service';
import { ModalService } from 'src/app/services/common/modal.service';
import { UtilsService } from 'src/app/services/common/utils.service';
import { ApiNodeService } from 'src/app/services/api/api-node.service';
import { NodeStoreService } from 'src/app/services/store/node-store.service';

@Component({
  selector: 'app-node-view',
  templateUrl: './node-view.component.html',
  styleUrls: [
    '../../../shared/scss/buttons.scss',
    './node-view.component.scss',
  ],
})
export class NodeViewComponent implements OnInit {
  node: Node = EMPTY_NODE;
  id: number = -1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiNodeService: ApiNodeService,
    private nodeStoreService: NodeStoreService,
    private utilsService: UtilsService,
    public userPermission: UserPermissionService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.init();
  }

  async init(): Promise<void> {
    // try to see if organization is already passed from organizationStoreService
    this.nodeStoreService
      .getNode()
      .pipe(take(1))
      .subscribe((node) => {
        this.node = node;
        this.id = this.node.id;
      });

    // subscribe to id parameter in route to change edited organization if
    // required
    this.activatedRoute.paramMap.subscribe((params) => {
      let new_id = this.utilsService.getId(params, ResType.NODE);
      if (new_id === EMPTY_NODE.id) {
        return; // cannot get organization
      }
      if (new_id !== this.id) {
        this.id = new_id;
        this.setNodeFromAPI(new_id);
      }
    });
  }

  async setNodeFromAPI(id: number): Promise<void> {
    this.node = await this.apiNodeService.getNode(id);
  }

  getStatus(): string {
    return this.node.is_online ? 'Online' : 'Offline';
  }

  async generateApiKey() {
    let api_key = await this.apiNodeService.reset_api_key(this.node);
    if (api_key) {
      // TODO properly format the command and api key to make them stand out!
      this.modalService.openMessageModal(ModalMessageComponent, [
        'Your new API key is:',
        api_key,
        `Please paste your new API key into your node configuration file. You
 can find your node configuration file by executing the command:`,
        'vnode files --name ' + this.node.name,
        'on the machine where your node is running',
      ]);
    }
  }

  editNodeName() {
    // open modal window to ask for confirmation of irreversible delete action
    this.modalService
      .openEditModal('name', this.node.name)
      .result.then((data) => {
        if (data.exitMode === ExitMode.EDIT) {
          this.executeEdit(data.new_value);
        }
      });
  }

  executeEdit(edited_value: string) {
    this.node.name = edited_value;
    this.apiNodeService.update(this.node).subscribe(
      (data) => {},
      (error) => {
        this.modalService.openMessageModal(ModalMessageComponent, [
          'Error:',
          error.error.msg,
        ]);
      }
    );
  }

  deleteNode() {
    console.log('deleting node');
  }
}
