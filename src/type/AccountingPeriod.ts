export interface AccountingPeriod {
    id: number | null,
    open: boolean,
    sent: boolean,
    paid: boolean,
    client: Client | null,
    closedOn: Date | null,
    createdOn: Date | null
}
