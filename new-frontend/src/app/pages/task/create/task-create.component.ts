import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlgorithmService } from 'src/app/services/algorithm.service';
import { Algorithm, ArgumentType, Function } from 'src/app/models/api/algorithm.model';
import { ChosenCollaborationService } from 'src/app/services/chosen-collaboration.service';
import { Subject, takeUntil } from 'rxjs';
import { BaseNode, DatabaseType } from 'src/app/models/api/node.model';
import { getDatabasesFromNode } from 'src/app/helpers/node.helper';
import { CreateTask, CreateTaskInput } from 'src/app/models/api/task.models';
import { TaskService } from 'src/app/services/task.service';
import { routePaths } from 'src/app/routes';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss']
})
export class TaskCreateComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  routes = routePaths;
  argumentType = ArgumentType;

  algorithms: Algorithm[] = [];
  algorithm: Algorithm | null = null;
  function: Function | null = null;
  databases: any[] = [];
  node: BaseNode | null = null;

  packageForm = this.fb.nonNullable.group({
    algorithmID: ['', Validators.required],
    name: ['', Validators.required],
    description: ['']
  });

  functionForm = this.fb.nonNullable.group({
    functionName: ['', Validators.required],
    organizationIDs: ['', Validators.required]
  });

  databaseForm = this.fb.nonNullable.group({});

  parameterForm = this.fb.nonNullable.group({});

  constructor(
    private fb: FormBuilder,
    private algorithmService: AlgorithmService,
    private taskService: TaskService,
    public chosenCollaborationService: ChosenCollaborationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.initData();

    this.packageForm.controls.algorithmID.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(async (algorithmID) => {
      this.handleAlgorithmChange(algorithmID);
    });

    this.functionForm.controls.functionName.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(async (functionName) => {
      this.handleFunctionChange(functionName);
    });

    this.functionForm.controls.organizationIDs.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(async (organizationID) => {
      this.handleOrganizationChange(organizationID);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  handleSubmit(): void {
    if (this.packageForm.invalid || this.functionForm.invalid || this.databaseForm.invalid || this.parameterForm.invalid) {
      return;
    }

    const selectedOrganizations = Array.isArray(this.functionForm.controls.organizationIDs.value)
      ? this.functionForm.controls.organizationIDs.value
      : [this.functionForm.controls.organizationIDs.value];
    const selectedDatabases: string[] = Object.keys(this.databaseForm.controls)
      .filter((control) => control.includes('_name'))
      .map((controlName) => this.databaseForm.get(controlName)?.value || '');

    const input: CreateTaskInput = {
      method: this.function?.name || '',
      kwargs: this.parameterForm.value
    };

    const createTask: CreateTask = {
      name: this.packageForm.controls.name.value,
      description: this.packageForm.controls.description.value,
      image: this.algorithm?.url || '',
      collaboration_id: this.chosenCollaborationService.collaboration$.value?.id || -1,
      databases: [...selectedDatabases],
      organizations: selectedOrganizations.map((organizationID) => {
        return { id: Number.parseInt(organizationID), input: btoa(JSON.stringify(input)) || '' };
      })
    };

    this.taskService.create(createTask);
  }

  private async initData(): Promise<void> {
    this.algorithms = await this.algorithmService.getAlgorithms();
  }

  private async handleAlgorithmChange(algorithmID: string): Promise<void> {
    //Clear form
    this.clearFunctionStep();
    this.clearDatabaseStep();
    this.clearParameterStep();

    //Get selected algorithm
    this.algorithm = await this.algorithmService.getAlgorithm(algorithmID);
  }

  private handleFunctionChange(functionName: string): void {
    //Clear form
    this.clearFunctionStep(); //Also clear function step, so user needs to reselect organization
    this.clearDatabaseStep();
    this.clearParameterStep();

    //Get selected function
    const selectedFunction = this.algorithm?.functions.find((_) => _.name === functionName) || null;

    //Add form controls for parameters for selected function
    selectedFunction?.arguments.forEach((argument) => {
      if (argument.type === ArgumentType.String) {
        this.parameterForm.addControl(argument.name, new FormControl(null, Validators.required));
      }
      if (argument.type === ArgumentType.Integer) {
        this.parameterForm.addControl(argument.name, new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$')]));
      }
      if (argument.type === ArgumentType.Float) {
        this.parameterForm.addControl(
          argument.name,
          new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*[,.]?[0-9]*$')])
        );
      }
    });

    //Add form controls for databases for selected function
    if (selectedFunction) {
      this.setFormControlsForDatabase(selectedFunction);
    }

    //Delay setting function, so that form controls are added
    this.function = selectedFunction;
  }

  private async handleOrganizationChange(organizationID: string): Promise<void> {
    //Clear form
    this.clearDatabaseStep();

    //Get organization id, from array or string
    let id = organizationID;
    if (Array.isArray(organizationID) && organizationID.length > 0) {
      id = organizationID[0];
    }

    //Get node
    if (id) {
      //Get all nodes for chosen collaboration
      const nodes = await this.chosenCollaborationService.getNodes();
      //Filter node for chosen organization
      this.node = nodes.find((_) => _.organization.id === Number.parseInt(id)) || null;

      //Get databases for node
      if (this.node) {
        this.databases = getDatabasesFromNode(this.node);
      }
    }

    if (this.function) {
      this.setFormControlsForDatabase(this.function);
    }
  }

  private clearFunctionStep(): void {
    this.functionForm.controls.organizationIDs.reset();
    Object.keys(this.databaseForm.controls).forEach((control) => {
      this.parameterForm.removeControl(control);
    });
  }

  private clearDatabaseStep(): void {
    Object.keys(this.databaseForm.controls).forEach((control) => {
      this.databaseForm.removeControl(control);
    });
  }

  private clearParameterStep(): void {
    Object.keys(this.parameterForm.controls).forEach((control) => {
      this.parameterForm.removeControl(control);
    });
  }

  private setFormControlsForDatabase(selectedFunction: Function) {
    selectedFunction?.databases.forEach((database) => {
      this.databaseForm.addControl(`${database.name}_name`, new FormControl(null, [Validators.required]));
      this.databaseForm
        .get(`${database.name}_name`)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(async (dataBaseName) => {
          //Clear form
          Object.keys(this.databaseForm.controls).forEach((control) => {
            if (control.startsWith(database.name) && !control.includes('_name')) this.databaseForm.removeControl(control);
          });

          //Add form controls for selected database
          const type = this.databases.find((_) => _.name === dataBaseName)?.type;
          if (type === DatabaseType.SQL || type === DatabaseType.OMOP || type === DatabaseType.Sparql) {
            this.databaseForm.addControl(`${database.name}_query`, new FormControl(null, [Validators.required]));
          }
          if (type === DatabaseType.Excel) {
            this.databaseForm.addControl(`${database.name}_sheet`, new FormControl(null, [Validators.required]));
          }
        });
    });
  }
}