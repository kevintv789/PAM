export interface State {
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
  navigation?: any;
  propertyData?: any;
}
