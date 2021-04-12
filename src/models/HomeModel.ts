export interface State {
  refreshing: boolean;
}

export interface Props {
  userData: {
    email: string;
    password: string;
    phone: string;
    properties: Array<object>;
    name: string;
  };
  getPropertiesByIds?: any;
  getUser?: any;
  navigation?: any;
  propertyData?: any;
}
