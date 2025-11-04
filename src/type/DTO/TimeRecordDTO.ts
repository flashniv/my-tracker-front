import { AccountingPeriod } from "../AccountingPeriod";

export interface TimeRecordDTO {
    id: number,
    duration: number,
    createdOn: Date,
    accountingPeriod: AccountingPeriod
}
