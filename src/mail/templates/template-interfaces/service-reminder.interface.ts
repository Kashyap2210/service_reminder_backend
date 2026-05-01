export interface ServiceReminderData {
  userName: string;
  serviceName: string;
  serviceDescription: string;
  appointmentDate: string;
  appointmentTime: string;
  vendorName: string;
  vendorContactEmail?: string;
  vendorContactPhone?: string;
  reminderMessage?: string;
}
