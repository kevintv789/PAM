export interface State {
  showNotesModal: boolean;
  notesValue: any;
  showAddExpenseModal: boolean;
}

export interface Props {
  tenantData: Array<any>;
  propertyData: any;
  expenseData: any;
  totalIncome: number;
}
