import { createContext } from "react";

export interface NotificationContextMessage {
    message: string,
    severity: "success" | "info" | "warning" | "error",
    duration: number
}

export const NotificationContext = createContext((alertMessage: NotificationContextMessage) => { });
