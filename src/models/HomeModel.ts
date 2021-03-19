export interface State {
  showModal: boolean;
  showDoneModal: boolean;
}

export interface Props {
  userData: {
    email: string;
    password: string;
    phone: string;
    properties: Array<object>;
    firstName: string;
  };
  getPropertiesByIds?: any;
  getUser?: any;
}
