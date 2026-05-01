import { EmailTemplate } from '../utils/email-template.enum';
import { ServiceReminderData } from './template-interfaces/service-reminder.interface';

export const dummyData: Record<EmailTemplate, ServiceReminderData> = {
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
};
