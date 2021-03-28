import { RefObject } from "react";

export interface State {
  primaryTenantName: string;
  phone: string | undefined;
  email: string;
  leaseType: string;
  leaseStartDate: string;
  leaseEndDate: string;
  rentPaidPeriod: string;
  rent: string;
  deposit: string;
  totalOccupants: number;
  notes: any;
  rentFormatted: string;
  depositFormatted: string;
  showNotesModal: boolean;
  lastPaymentDate: string;
  hasTenantPaidFirstRent: boolean;
  errors: string[];
}

export interface Props {
  navigation?: any;
  addTenant?: any;
  updateProperty?: any;
  updateTenant?: any;
}
