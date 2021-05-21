export interface State {
  email: string;
  password: string;
  errors: Array<string>;
  isLoading: boolean;
  rememberMe: boolean;
}

export interface Props {
  navigation: any;
}
