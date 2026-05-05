import { Nullable } from 'service_reminder_common';

export interface IServiceReminderTemplateData {
  recipientName: string;
  recurringItemName: string; // ← was serviceName
  daysUntilDue: number;
  nextDueDate: string;
  vendors: {
    vendorId: number;
    name: string;
    contactNo: string;
    email: string | null;
  }[];
  lastServiceDate: Nullable<number>;
  lastServiceVendorName: string | null;
  lastServiceAmount: number | null;
  baseUrl: string;
  recurringItemId: number;
  userId: number;
}
