
export interface ArduinoProject {
  id: string;
  name: string;
  code: string;
  description: string;
  libraries: string[];
  wiring: string;
  controls: PinControl[];
  batteryType?: string;
  createdAt: number;
}

export interface PinControl {
  id: string;
  pin: number;
  label: string;
  type: 'digital' | 'buzzer' | 'analog' | 'servo' | 'input';
  lastState: boolean | number;
  config?: {
    duration?: number;
    frequency?: number;
  };
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  balance: number;
  lastCheckIn: number | null;
  referralCode: string;
  referredBy: string | null;
  projectCount: number;
  taskStartTime: number;
  validFriendsCount: number;
  ewallet: EwalletInfo | null;
  isAdmin?: boolean;
}

export interface EwalletInfo {
  type: 'dana' | 'ovo' | 'gopay';
  ownerName: string;
  number: string;
}

export interface WithdrawalRequest {
  id: string;
  uid: string;
  userEmail: string;
  amount: number;
  ewallet: EwalletInfo;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
}

export enum ComponentType {
  BOARD = 'Board',
  SENSOR = 'Sensor',
  INTERFACE = 'Interface',
  ACTUATOR = 'Actuator',
  COMMUNICATION = 'Communication',
  ACCESSORY = 'Accessory'
}

export interface HardwareComponent {
  name: string;
  type: ComponentType;
  description: string;
  libraries?: string[];
}

export interface AIResponse {
  code: string;
  explanation: string;
  libraries: string[];
  wiringInstructions: string;
}

export interface ProjectAudit {
  score: number;
  summary: string;
  checks: {
    category: string;
    status: string;
    message: string;
  }[];
  recommendations: string[];
}
