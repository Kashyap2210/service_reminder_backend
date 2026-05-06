import { EmailTemplate } from '../utils/email-template.enum';
import { IAppointmentCreated } from './template-interfaces/appointment-created.interface';
import { IRecurringItemCreated } from './template-interfaces/recurring-item-created.interface';
import { IServiceCreated } from './template-interfaces/service-created.interface';
import { IUserSignUp } from './template-interfaces/user-signup.interface';
import { IVendorCreated } from './template-interfaces/vendor-created.interface';

// type EmailTemplateData = {
//   [EmailTemplate.SERVICE_REMINDER]: IServiceReminder;
//   [EmailTemplate.USER_SIGNUP]: IUserSignUp;
// };


export const dummyData = {
  [EmailTemplate.SERVICE_REMINDER]: {
    recipientName: 'John Doe',
    recurringItemName: 'Annual Car Service',
    daysUntilDue: 7,
    nextDueDate: 'May 10, 2026',
    vendors: [
      {
        name: 'Premium Auto Services',
        contactNo: '+1 (555) 123-4567',
        email: 'contact@premiumauto.com',
      },
      {
        name: 'Quick Fix Garage',
        contactNo: '+1 (555) 987-6543',
        email: null,
      },
    ],
    lastServiceDate: 'Nov 10, 2025',
    lastServiceVendorName: 'Premium Auto Services',
    lastServiceAmount: 4500,
  },
  [EmailTemplate.USER_SIGNUP]: {
    name: 'John Doe',
    email: 'johndoe@example.com',
    contactNo: '+1 (555) 123-4567',
    year: new Date().getFullYear(),
  } satisfies IUserSignUp,
  [EmailTemplate.APPOINTMENT_CREATED]: {
    appointmentDate: 'May 20, 2026',
    appointmentType: 'Maintenance',
    appointmentStatus: 'Confirmed',
    vendorName: 'Premium Auto Services',
    vendorAddress: '123 Auto Street, Service City, SC 12345',
    recurringItemName: 'Quarterly Car Maintenance',
    userName: 'John Doe',
    year: new Date().getFullYear(),
  } satisfies IAppointmentCreated,
  [EmailTemplate.RECURRING_ITEM_CREATED]: {
    name: 'Quarterly Car Maintenance',
    type: 'Preventive',
    companyName: "John's Fleet Services",
    servicePeriod: '3',
    servicePeriodUnit: 'months',
    userName: 'John Doe',
    year: new Date().getFullYear(),
  } satisfies IRecurringItemCreated,
  [EmailTemplate.SERVICE_CREATED]: {
    serviceDate: 'May 18, 2026',
    serviceType: 'Electrical Repair',
    serviceStatus: 'Scheduled',
    vendorName: 'ElectroFix Services',
    recurringItemName: 'Monthly Electrical Check',
    serviceEstimate: '4-6 hours',
    serviceAmount: 250,
    userName: 'John Doe',
    year: new Date().getFullYear(),
  } satisfies IServiceCreated,
  [EmailTemplate.VENDOR_CREATED]: {
    name: 'Premium Auto Services',
    contactNo: '+1 (555) 234-5678',
    email: 'info@premiumauto.com',
    address: '123 Auto Street, Service City, SC 12345',
    userName: 'John Doe',
    year: new Date().getFullYear(),
  } satisfies IVendorCreated,
};
