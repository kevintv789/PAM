export interface State {
  showNotesModal: boolean;
  notesValue: string;
}

export interface Props {
  tenantData: Array<any>;
  propertyData: any;
  expenseData: any;
  totalIncome: number;
}
