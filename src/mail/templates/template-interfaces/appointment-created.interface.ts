export interface IAppointmentCreated {
  appointmentDate: string;
  appointmentType: string;
  appointmentStatus: string;
  vendorName: string;
  recurringItemName?: string;
  userName: string;
  year: number;
}
