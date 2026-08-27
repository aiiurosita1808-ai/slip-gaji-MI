export interface Teacher {
  id: string;
  nip: string;
  name: string;
  position: string;
  additionalTask: string;
  workTenure: string;
  phone?: string;
  email?: string;

  // Penerimaan
  basicSalary: number;
  teachingLoad: number;
  homeroomIncentive: number;
  annualPerformanceIncentive: number;
  monthlyPerformanceIncentive: number;
  tenureAllowance: number;
  educationAllowance: number;
  bpjsAllowance: number;
  qurbanAllowance: number;

  // Potongan
  bpjsDeduction: number;
  qurbanDeduction: number;
}

export interface SalarySlip {
  id: string;
  teacherId: string;
  month: string;
  year: number;
  date: string;
  
  teacherName: string;
  teacherNip: string;
  teacherPosition: string;
  teacherAdditionalTask: string;
  teacherWorkTenure: string;

  basicSalary: number;
  teachingLoad: number;
  homeroomIncentive: number;
  annualPerformanceIncentive: number;
  monthlyPerformanceIncentive: number;
  tenureAllowance: number;
  educationAllowance: number;
  bpjsAllowance: number;
  qurbanAllowance: number;

  bpjsDeduction: number;
  qurbanDeduction: number;

  totalPenerimaan: number;
  totalPotongan: number;
  totalSalary: number;
}

export type TabType = 'dashboard' | 'teachers' | 'slips' | 'settings';

export interface AppSettings {
  schoolName: string;
  schoolAddress: string;
  academicYear: string;
  signatoryName: string;
  signatoryRole: string;
  signatoryNip: string;
  waTemplate: string;
  fonnteToken: string;
}
