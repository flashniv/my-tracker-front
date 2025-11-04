import { AccountingPeriod } from "./AccountingPeriod";

export interface TimeRecord{
        id: number,
        duration: number,
        createdOn: Date,
        accountingPeriod: AccountingPeriod
}