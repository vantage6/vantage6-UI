import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {BaseApiService} from "../base-api.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService extends BaseApiService{

  protected getApiPath(path: string): string {
    //TODO: Lazy loaded calls already include API path
    if (path.startsWith('/') && path.startsWith(environment.api_path)) {
      return environment.server_url + path;
    }
    return environment.server_url + environment.api_path + path;
  }
}
