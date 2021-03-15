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
}

export interface defaultProps {
  handleCancelClicked: any;
  navigation: any;
}
