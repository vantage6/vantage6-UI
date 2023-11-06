import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { routePaths } from '../routes';
import { CHOSEN_COLLABORATION } from '../models/constants/sessionStorage';
import { ResourceType, OperationType } from '../models/api/rule.model';
import { PermissionService } from '../services/permission.service';
import { CollaborationService } from '../services/collaboration.service';

export function chosenCollaborationGuard(resource?: ResourceType, operation?: OperationType): CanActivateFn {
  return async () => {
    const router: Router = inject(Router);
    const permissionService: PermissionService = inject(PermissionService);
    const collaborationService: CollaborationService = inject(CollaborationService);

    const chosenCollaboration = sessionStorage.getItem(CHOSEN_COLLABORATION);
    if (!chosenCollaboration) {
      router.navigate([routePaths.start]);
      return false;
    }

    const collaboration = await collaborationService.getCollaboration(chosenCollaboration);
    return resource != null && operation != null ? permissionService.isAllowedForCollab(resource, operation, collaboration) : true;
  };
}
