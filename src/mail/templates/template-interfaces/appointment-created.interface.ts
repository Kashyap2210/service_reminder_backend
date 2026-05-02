export interface IAppointmentCreated {
  appointmentDate: string;
  appointmentType: string;
  appointmentStatus: string;
  vendorName: string;
  vendorAddress?: string;
  recurringItemName?: string;
  userName: string;
  year: number;
}
