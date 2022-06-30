import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { EMPTY_NODE, NodeWithOrg } from 'src/app/interfaces/node';
import { UtilsService } from 'src/app/services/common/utils.service';
import { NodeDataService } from 'src/app/services/data/node-data.service';
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
  REQUIRED_ALERT: string = 'This field is required';

  route_id: number | null = null;
  node: NodeWithOrg = EMPTY_NODE;
  formGroup: FormGroup;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['labels', 'paths'];

  config = new NodeConfig('', this.ENVS[0], true, []);
  submitted = false;

  server_url = environment.server_url;
  server_port = environment.server_port;
  api_path = environment.api_path;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private nodeDataService: NodeDataService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.readRoute();
    this.createForm();
  }

  createForm(): void {
    this.formGroup = this.formBuilder.group(
      {
        name: [null, [Validators.required]],
        environment: [this.ENVS[0], [Validators.required]],
        is_generate_api_key: [true, []],
        api_key: [null, []],
        databases: [this.formBuilder.array([]), []],
      },
      {
        // validator: this.hasApiKeyOrGeneratingOne,
      }
    );
    // initialize databases
    const row = new FormGroup({
      label: new FormControl('default', Validators.required),
      path: new FormControl('', Validators.required),
    });
    const formArray = new FormArray([row]);
    this.dataSource = new MatTableDataSource(formArray.controls);
    // this.formGroup.setControl('databases', )
    // this.databases.push(row);
  }

  get name() {
    return this.formGroup.get('name') as FormControl;
  }

  get api_key() {
    return this.formGroup.get('api_key') as FormControl;
  }

  get databases(): FormArray {
    return this.formGroup.get('databases') as FormArray;
  }

  // hasApiKeyOrGeneratingOne(formGroup: FormGroup) {
  //   let is_generating = formGroup.controls['is_generate_api_key'].value;
  //   let api_key = formGroup.controls['api_key'].value;
  //   console.log(is_generating);
  //   console.log(api_key);
  //   console.log(is_generating || api_key);
  //   // if (! )
  //   console.log(is_generating || api_key ? { requirements: true } : null);
  //   return is_generating || api_key ? null : { noApiKey: true };
  // }

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
    this.setNode();
  }

  async setNode(): Promise<void> {
    this.node = await this.nodeDataService.get(this.route_id as number);
  }

  selectEnv(env: string): void {
    this.config.environment = env;
  }

  download() {
    this.submitted = true;
    console.log(this.config);
    console.log(this.formGroup.value);
  }
  cancel() {}
}
