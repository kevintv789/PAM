export interface initialState {
    expenseName: string,
    amount: string,
    paidOnDate: Date,
    status: string,
    recurring: boolean,
    notes: any;
    showNotesModal: boolean;
}

export interface defaultProps {
    handleCancelClicked: any
}