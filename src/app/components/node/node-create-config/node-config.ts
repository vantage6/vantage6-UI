export class NodeConfig {
  constructor(
    public name: string,
    public environment: string,
    public is_create_api_key: boolean,
    public databases: string[],
    public api_key?: string
  ) {}
}
