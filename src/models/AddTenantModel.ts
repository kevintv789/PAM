import { RefObject } from "react";

export interface State {
  primaryTenantName: string;
  phone: string | undefined;
  email: string;
  leaseType: string;
  leaseStartDate: string;
  leaseEndDate: string;
  rentPaidPeriod: string;
  rent: number;
  deposit: number;
  totalOccupants: number;
  notes: any;
  showNotesModal: boolean;
  lastPaymentDate: string;
  hasTenantPaidFirstRent: boolean;
  errors: string[];
  isLoading: boolean;
}

export interface Props {
  navigation?: any;
  addTenant?: any;
  updateProperty?: any;
  updateTenant?: any;
  addFinances?: any;
}
