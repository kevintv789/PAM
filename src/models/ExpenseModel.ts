export interface initialState {
  expenseName: string;
  amount: string;
  amountFormatted: string;
  expenseStatusDate: string;
  expenseStatus: string;
  recurring: boolean;
  notes: any;
  showNotesModal: boolean;
  showRecurringModal: boolean;
  recurringText: string;
  errors: string[];
  activeTabIndex?: number;
}

export interface defaultProps {
  handleCancelClicked: any;
  navigation: any;
  addExpense: any;
}
