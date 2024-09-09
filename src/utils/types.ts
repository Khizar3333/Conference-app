import { Dispatch, SetStateAction } from 'react'

export type LoginProps = {
  token: string
  setToken: Dispatch<SetStateAction<string>>
}

export type TxnParams = {
  from: string | null;
  to: string | null;
  value: string;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  gasPrice?: string;
};
export interface UserInfo {
  firstname: string;
  lastname: string;
  email: string;
  jobtitle: string;
  company: string;
  website: string;
  message: string;
  nextjsexpr: string;
  ticket_type: string;
}

export interface UserData {
  name: string;
  email: string;
  event_name: string;
  ticket_number: string;
}

// TODO: Import Magic type from the correct location
export type { Magic } from 'magic-sdk';
// Temporarily comment out or remove the import until the correct path is determined
