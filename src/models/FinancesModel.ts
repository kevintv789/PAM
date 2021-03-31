export interface initialState {
  name: string;
  amount: string;
  amountFormatted: string;
  expenseStatusDate: string;
  expenseStatus: string;
  recurring?: boolean;
  notes: any;
  showNotesModal: boolean;
  showRecurringModal: boolean;
  recurringText?: string;
  errors: string[];
}

export interface defaultProps {
  navigation: any;
  addFinances?: any;
  isEditting?: boolean;
  reportData?: any;
  updateFinances: (payload: any) => { type: string; payload: any };
  propertyId: number;
}

export interface addFinancesState {
  activeTabIndex: number;
}
