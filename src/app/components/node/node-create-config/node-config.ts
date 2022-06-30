export interface DatabaseInfo {
  label: string;
  path: string;
}

export class NodeConfig {
  constructor(
    public name: string,
    public environment: string,
    public is_create_api_key: boolean,
    public databases: [DatabaseInfo],
    public log_level: string,
    public is_configure_vpn: boolean,
    public vpn_subnet: string,
    public is_encrypted: boolean,
    public allow_all_algorithms: boolean,
    public allowed_algorithms: [{ algo_exp: string }],
    public private_key_path?: string,
    public api_key?: string
  ) {}
}
