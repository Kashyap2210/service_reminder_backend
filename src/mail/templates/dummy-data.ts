import { EmailTemplate } from '../utils/email-template.enum';
import { IUserSignUp } from './template-interfaces/user-signup.interface';

// type EmailTemplateData = {
//   [EmailTemplate.SERVICE_REMINDER]: IServiceReminder;
//   [EmailTemplate.USER_SIGNUP]: IUserSignUp;
// };

export const dummyData = {
  [EmailTemplate.SERVICE_REMINDER]: {
    userName: 'John Doe',
    serviceName: 'Annual Car Service',
    serviceDescription:
      'Comprehensive vehicle maintenance including oil change, filter replacement, and inspection',
    appointmentDate: 'May 15, 2026',
    appointmentTime: '10:00 AM',
    vendorName: 'Premium Auto Services',
    vendorContactEmail: 'contact@premiumauto.com',
    vendorContactPhone: '+1 (555) 123-4567',
    reminderMessage:
      'Please arrive 5-10 minutes early to check in. Bring your vehicle keys and ownership documents.',
  },
  [EmailTemplate.USER_SIGNUP]: {
    name: 'John Doe',
    email: 'johndoe@example.com',
    contactNo: '+1 (555) 123-4567',
    year: new Date().getFullYear(),
  } satisfies IUserSignUp,
};
