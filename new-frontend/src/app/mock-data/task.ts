import { NodeStatus } from '../models/api/node.model';
import { Task, TaskStatus } from '../models/api/task.models';

const pendingRun = {
  id: 1,
  status: TaskStatus.Pending,
  input: '',
  node: {
    name: ' CareTogether - Elastique',
    status: null,
    id: 1
  },
  assigned_at: '2023-08-22T14:34:53.320187'
};

const activeRun = {
  id: 2,
  status: TaskStatus.Active,
  input: '',
  node: {
    name: ' CareTogether - IKNL',
    status: NodeStatus.Online,
    id: 2
  },
  assigned_at: '2023-08-22T14:34:53.320187',
  started_at: '2023-08-22T14:34:53.320187',
  failed_at: '2023-08-22T14:34:53.320187'
};

const failedRun = {
  id: 3,
  status: TaskStatus.Failed,
  input: '',
  node: {
    name: ' CareTogether - Bosco',
    status: NodeStatus.Online,
    id: 3
  },
  assigned_at: '2023-08-22T14:34:53.320187',
  started_at: '2023-08-22T14:34:53.320187',
  failed_at: '2023-08-22T14:34:53.320187',
  log: '{"test":{"test": "test"}}'
};

const completedRun = {
  id: 4,
  status: TaskStatus.Completed,
  input: '',
  node: {
    name: ' CareTogether - Homenick',
    status: NodeStatus.Online,
    id: 4
  },
  assigned_at: '2023-08-22T14:34:53.320187',
  started_at: '2023-08-22T14:34:53.320187',
  failed_at: '2023-08-22T14:34:53.320187'
};

const result = {
  id: 4,
  result: btoa(
    JSON.stringify({
      age: {
        max: 85,
        mean: 49.69,
        min: 18,
        nan: 0,
        std: 20.526419561141196,
        var: 421.33389999999997,
        _type: 'numerical'
      },
      b02_edu: {
        '1': 14,
        '2': 21,
        '3': 19,
        '4': 23,
        '5': 23,
        _type: 'catagorical'
      },
      b04_sex: {
        '1': 50,
        '2': 50,
        _type: 'categorical'
      },
      b05_ethni: {
        '1': 23,
        '2': 27,
        '3': 21,
        '4': 29,
        _type: 'categorical'
      },
      b07_smoke: {
        '1': 31,
        '2': 38,
        '3': 31,
        _type: 'categorical'
      },
      b18_bmi: {
        max: 102.0,
        mean: 32.512,
        min: 8.1,
        nan: 0,
        std: 18.51280789075498,
        var: 342.72405599999996,
        _type: 'numerical'
      },
      b19_comorb: {
        '1': 50,
        '2': 50,
        _type: 'categorical'
      },
      column_names_correct: true,
      d05_histo: {
        '1': 6,
        '2': 10,
        '3': 9,
        '4': 7,
        '5': 10,
        '6': 8,
        '7': 9,
        '8': 10,
        '9': 9,
        '10': 12,
        '11': 10,
        _type: 'categorical'
      },
      d28_pdl: {
        '1': 31,
        '2': 35,
        '3': 34,
        _type: 'categorical'
      },
      d32_crp: {
        '1': 38,
        '2': 32,
        '3': 30,
        _type: 'categorical'
      },
      h01_status: {
        '1': 21,
        '2': 19,
        '3': 18,
        '4': 30,
        '5': 12,
        _type: 'categorical'
      },
      number_of_rows: 100,
      site: {
        '5': 23,
        '6': 23,
        '7': 39,
        '8': 15,
        _type: 'categorical'
      }
    })
  )
};

export const mockTaskWithMultipleRunStatuses: Task = {
  id: 1,
  name: 'Test task',
  description: 'Task with multiple run statuses',
  status: TaskStatus.Failed,
  image: 'https://harbor2.vantage6.ai/demo/average',
  runs: [pendingRun, activeRun, failedRun, completedRun],
  input: {
    method: 'central_average',
    parameters: []
  }
};

export const mockTaskCompleted: Task = {
  id: 1,
  name: 'Test task',
  description: 'Task with single result',
  status: TaskStatus.Completed,
  image: 'https://harbor2.vantage6.ai/demo/average',
  results: [result],
  runs: [completedRun],
  input: {
    method: 'partial_average',
    parameters: []
  }
};
