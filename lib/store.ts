import { create } from "zustand";

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  tier: "basic" | "plus" | "pro";
  altitudeLimit: string;
  highlights: string[];
  includes: string[];
}

export interface InsurancePlan {
  id: string;
  name: string;
  price: number;
  coverage: string[];
}

export interface TravellerInfo {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "";
  age?: number;
  // For minors (under 18)
  nomineeName?: string;
  nomineeRelation?: string;
  // Emergency contact for each traveller
  emergencyName?: string;
  emergencyContact?: string;
  emergencyEmail?: string;
}

export interface UserInfo {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  passportNumber: string;
  nationality: string;
  countryOfResidence: string;
  billingAddress: string;
  agreeToTerms: boolean;
}

export interface TripDetails {
  nationality: string;
  numberOfTravellers: number;
  travellingFrom: string;
  travellingTo: string;
  adventure: string;
  startDate: string;
  endDate: string;
}

export interface BookingDetails {
  selectedPackage: Package | null;
  duration: string;
  altitudeLimit: string;
  insurancePlan: InsurancePlan | null;
  deviceDeposit: number;
  tripDetails: TripDetails;
  travellers: TravellerInfo[];
  primaryContact: {
    name: string;
    email: string;
    phone: string;
    countryCode: string;
    billingAddress: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
  };
}

export interface PaymentInfo {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardholderName: string;
}

interface PaymentStore {
  selectedPackage: Package | null;
  bookingDetails: BookingDetails;
  userInfo: UserInfo;
  paymentInfo: PaymentInfo;
  setSelectedPackage: (pkg: Package) => void;
  setBookingDetails: (details: Partial<BookingDetails>) => void;
  setUserInfo: (info: UserInfo) => void;
  setPaymentInfo: (info: PaymentInfo) => void;
  reset: () => void;
}

const initialBookingDetails: BookingDetails = {
  selectedPackage: null,
  duration: "14",
  altitudeLimit: "3500",
  insurancePlan: null,
  deviceDeposit: 0,
  tripDetails: {
    nationality: "",
    numberOfTravellers: 1,
    travellingFrom: "",
    travellingTo: "",
    adventure: "",
    startDate: "",
    endDate: "",
  },
  travellers: [],
  primaryContact: {
    name: "",
    email: "",
    phone: "",
    countryCode: "+977",
    billingAddress: "",
  },
  emergencyContact: {
    name: "",
    phone: "",
  },
};

const initialUserInfo: UserInfo = {
  fullName: "",
  email: "",
  phone: "",
  countryCode: "+977",
  passportNumber: "",
  nationality: "",
  countryOfResidence: "",
  billingAddress: "",
  agreeToTerms: false,
};

const initialPaymentInfo: PaymentInfo = {
  cardNumber: "",
  expiry: "",
  cvv: "",
  cardholderName: "",
};

export const usePaymentStore = create<PaymentStore>((set) => ({
  selectedPackage: null,
  bookingDetails: initialBookingDetails,
  userInfo: initialUserInfo,
  paymentInfo: initialPaymentInfo,
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
  setBookingDetails: (details) =>
    set((state) => ({
      bookingDetails: { ...state.bookingDetails, ...details },
    })),
  setUserInfo: (info) => set({ userInfo: info }),
  setPaymentInfo: (info) => set({ paymentInfo: info }),
  reset: () =>
    set({
      selectedPackage: null,
      bookingDetails: initialBookingDetails,
      userInfo: initialUserInfo,
      paymentInfo: initialPaymentInfo,
    }),
}));
