export interface State {
  refreshing: boolean;
  isLoading: boolean;
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
  aggregatedProperties?: any[];
  tenantData?: any[];
  getTenants?: () => any;
  getPropertyFinances?: any;
  financesData?: any[];
}
