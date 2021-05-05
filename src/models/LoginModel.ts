export interface State {
    email: string;
    password: string;
    errors: Array<string>;
    isLoading: boolean;
}

export interface Props {
    navigation: any
}