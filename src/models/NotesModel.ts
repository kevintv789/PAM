export interface State {
  value: any;
}

export interface Props {
  label: string;
  handleBackClick: any;
  notesData?: any;
}

export interface Note {
  createdOn: Date;
  updatedOn: Date;
  value: string;
}