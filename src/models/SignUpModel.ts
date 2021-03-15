export interface State {
    email: string;
    password: string;
    errors: Array<string>;
    phone: string;
    firstName: string;
}

export interface Props {
    navigation: any
}