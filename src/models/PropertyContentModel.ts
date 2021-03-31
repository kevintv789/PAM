export interface State {
  showNotesModal: boolean;
  notesValue: any;
}

export interface Props {
  tenantData: Array<any>;
  propertyData: any;
  expenseData: any;
  totalIncome: number;
  navigation: any;
}
