import React from 'react';
import WalletMethods from '../magic/cards/WalletMethodsCard';
import SendTransaction from '../magic/cards/SendTransactionCard';
import Spacer from '@/components/ui/Spacer';
import { LoginProps } from '@/utils/types';
import UserInfo from '@/components/magic/cards/UserInfoCard';
import DevLinks from './DevLinks';

import SmartContract from '../magic/cards/SmartContract';
import { isTestnet } from '@/utils/smartContract';

export default function Dashboard({ token, setToken }: LoginProps) {
  return (
    <div className="home-page">
    <div className="cards-container">
      <h1 className="text-7xl font-semibold">Nextjs Config is here</h1>
      <br />
      <p className='font-medium text-3xl'>October 24TH - SAN FRANCISCO</p>
      
    </div>
  </div>
  );
}
