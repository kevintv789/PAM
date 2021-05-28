export interface initialState {
  name: string;
  amount: number;
  expenseStatusDate: string;
  expenseStatus: string;
  recurring?: boolean;
  notes: any;
  showNotesModal: boolean;
  showRecurringModal: boolean;
  recurringText?: string;
  errors: string[];
  isLoading: boolean;
}

export interface defaultProps {
  navigation?: any;
  addFinances?: any;
  isEditting?: boolean;
  reportData?: any;
  updateFinances?: (payload: any) => { type: string; payload: any };
  propertyId?: number;
  incomeImages?: any[];
  expenseImages?: any[];
}

export interface addFinancesState {
  activeTabIndex: number;
  showAddImageModal: boolean;
  expenseImages: any[];
  incomeImages: any[];
  showWarningModal: boolean;
  imageToDelete: any;
}
