import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExitMode } from 'src/app/globals/enum';

import { Role, EMPTY_ROLE } from 'src/app/interfaces/role';
import { ModalService } from 'src/app/modal/modal.service';

import { RoleService } from 'src/app/services/api/role.service';
import { UserPermissionService } from 'src/app/services/user-permission.service';

@Component({
  selector: 'app-role-view',
  templateUrl: './role-view.component.html',
  styleUrls: ['../../globals/buttons.scss', './role-view.component.scss'],
})
export class RoleViewComponent implements OnInit {
  @Input() role: Role = EMPTY_ROLE;
  @Output() deletingRole = new EventEmitter<Role>();
  @Output() editingRole = new EventEmitter<Role>();

  constructor(
    public userPermission: UserPermissionService,
    public roleService: RoleService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {}

  executeDelete(): void {
    this.roleService.delete(this.role).subscribe(
      (data) => {
        this.deletingRole.emit(this.role);
      },
      (error) => {
        alert(error.error.msg);
      }
    );
  }

  deleteRole(): void {
    // open modal window to ask for confirmation of irreversible delete action
    this.modalService.openDeleteModal(this.role).result.then((exit_mode) => {
      if (exit_mode === ExitMode.DELETE) {
        this.executeDelete();
      }
    });
  }

  editRole(): void {
    this.role.is_being_edited = true;
    this.editingRole.emit(this.role);
  }
}