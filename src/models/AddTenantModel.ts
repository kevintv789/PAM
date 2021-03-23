export interface State {
  primaryTenantName: string;
  phone: string;
  email: string;
  leaseType: string;
  leaseStartDate: string;
  leaseEndDate: string;
  rentPaidPeriod: string;
  rent: string;
  deposit: string;
  totalOccupants: number;
  notes: string;
  rentFormatted: string;
  depositFormatted: string;
}

export interface Props {
    navigation?: any;
}
