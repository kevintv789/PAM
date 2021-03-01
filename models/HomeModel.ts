export interface State {
  user: {
    email: string;
    password: string;
    phone: string;
    properties: Array<object>;
    firstName: string;
  };
  showModal: boolean;
  showDoneModal: boolean;
}
