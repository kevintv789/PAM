export interface initialState {
  expenseName: string;
  amount: string;
  expenseStatusDate: string;
  expenseStatus: string;
  recurring: boolean;
  notes: any;
  showNotesModal: boolean;
  showRecurringModal: boolean;
}

export interface defaultProps {
  handleCancelClicked: any;
}
