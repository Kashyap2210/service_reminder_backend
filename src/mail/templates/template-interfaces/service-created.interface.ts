export interface IServiceCreated {
  serviceDate: string;
  serviceType: string;
  serviceStatus: string;
  vendorName: string;
  recurringItemName?: string;
  serviceEstimate?: string;
  serviceAmount?: number;
  userName: string;
  year: number;
}
