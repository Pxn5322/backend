import { TicketPriority, TicketSentiment, TicketStatus } from "../../generated/prisma";

export interface CreateTicketDTO {
    title: string;
    rawText: string;
}

export interface UpdateTicketDTO {
    title?: string;
    rawText?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    sentiment?: TicketSentiment;
}