import moment from "moment";

export const VALID_EMAIL = "test@test.com";
export const VALID_PASSWORD = "test123";

export const PropertyTypes = [
  "Apartment/Condo",
  "Single Family",
  "Multi-Family",
  "Townhouse",
  "Other",
];

export const Tenants = [
  {
    id: 1,
    properties: [2],
    name: "Elizabeth Olsen",
    phone: "1234567890",
    email: "eliza@gmail.com",
    leaseType: "monthly", // monthly or fixed term
    leaseStartDate: "1/12/2021",
    leaseEndDate: null,
    securityDeposit: 500,
    recurringPaymentType: "Monthly", // monthly, quarterly, annually, etc. this will be used to calculate next expected payment
    totalOccupants: 1,
    notes: "",
    rent: 1000,
    collectionDay: 1, // Day of the month that rent is collected. if 0 or null, then default to the lease start date day
    lastPaymentDate: "02/12/2021",
    nextPaymentDate: "3/12/2021", // calculcated from current month on the collection day of the month
  },
  {
    id: 2,
    properties: [2],
    name: "Lady Gaga",
    phone: "1234567890",
    email: "eliza@gmail.com",
    leaseType: "monthly",
    leaseStartDate: "1/12/2021",
    leaseEndDate: null,
    securityDeposit: 500,
    recurringPaymentType: "Monthly",
    totalOccupants: 1,
    notes: "",
    rent: 1000,
    collectionDay: 0,
    lastPaymentDate: "02/12/2021",
    nextPaymentDate: "3/12/2021", // calculcated from current month on the collection day of the month
  },
  {
    id: 3,
    properties: [2],
    name: "Ed Sheeran",
    phone: "1234567890",
    email: "eliza@gmail.com",
    leaseType: "monthly",
    leaseStartDate: "1/12/2021",
    leaseEndDate: null,
    securityDeposit: 500,
    recurringPaymentType: "Monthly",
    totalOccupants: 1,
    notes: "",
    rent: 1000,
    collectionDay: null,
    lastPaymentDate: "02/12/2021",
    nextPaymentDate: "3/12/2021", // calculcated from current month on the collection day of the month
  },
  {
    id: 4,
    properties: [1],
    name: "Sam Smith",
    phone: "1234567890",
    email: "eliza@gmail.com",
    leaseType: "monthly",
    leaseStartDate: "1/12/2021",
    leaseEndDate: null,
    securityDeposit: 500,
    recurringPaymentType: "Monthly",
    totalOccupants: 1,
    notes: "",
    rent: 1000,
    collectionDay: 1,
    lastPaymentDate: "03/01/2021",
    nextPaymentDate: "04/01/2021", // calculcated from current month on the collection day of the month
  },
  {
    id: 5,
    properties: [1],
    name: "Ashton Kutcher",
    phone: "1234567890",
    email: "eliza@gmail.com",
    leaseType: "monthly",
    leaseStartDate: "1/03/2021",
    leaseEndDate: null,
    securityDeposit: 500,
    recurringPaymentType: "Monthly",
    totalOccupants: 1,
    notes: "",
    rent: 1000,
    collectionDay: null,
    lastPaymentDate: "01/03/2021",
    nextPaymentDate: "3/02/2021", // calculcated from current month on the collection day of the month
  },
  {
    id: 6,
    properties: [4],
    name: "Mariah Carey",
    phone: "1234567890",
    email: "eliza@gmail.com",
    leaseType: "monthly",
    leaseStartDate: "11/11/2011",
    leaseEndDate: null,
    securityDeposit: 500,
    recurringPaymentType: "Monthly",
    totalOccupants: 1,
    notes: "",
    rent: 1000,
    collectionDay: 0,
    lastPaymentDate: "01/11/2021",
    nextPaymentDate: "3/11/2021", // calculcated from current month on the collection day of the month
  },
  {
    id: 7,
    properties: [4],
    name: "Miley Cyrus",
    phone: "1234567890",
    email: "eliza@gmail.com",
    leaseType: "monthly",
    leaseStartDate: "10/11/2018",
    leaseEndDate: null,
    securityDeposit: 500,
    recurringPaymentType: "Monthly",
    totalOccupants: 1,
    notes: "",
    rent: 1000,
    collectionDay: 0,
    lastPaymentDate: "03/11/2021",
    nextPaymentDate: "03/11/2021", // calculcated from current month on the collection day of the month
  },
  {
    id: 8,
    properties: [4],
    name: "Elizabeth Wiley",
    phone: "1234567890",
    email: "eliza@gmail.com",
    leaseType: "monthly",
    leaseStartDate: "4/18/2019",
    leaseEndDate: null,
    securityDeposit: 500,
    recurringPaymentType: "Monthly",
    totalOccupants: 1,
    notes: "",
    rent: 1000,
    collectionDay: 0,
    lastPaymentDate: "03/18/2021",
    nextPaymentDate: "03/18/2021", // calculcated from current month on the collection day of the month
  },
  {
    id: 9,
    properties: [4],
    name: "Cody Sprouse",
    phone: "1234567890",
    email: "eliza@gmail.com",
    leaseType: "monthly",
    leaseStartDate: "2/12/2021",
    leaseEndDate: null,
    securityDeposit: 500,
    recurringPaymentType: "Monthly",
    totalOccupants: 1,
    notes: "",
    rent: 1000,
    collectionDay: 0,
    lastPaymentDate: "03/05/2021",
    nextPaymentDate: "03/05/2021",
  },
  {
    id: 10,
    properties: [4],
    name: "Zach Sprouse",
    phone: "1234567890",
    email: "eliza@gmail.com",
    leaseType: "monthly",
    leaseStartDate: "1/12/2020",
    leaseEndDate: null,
    securityDeposit: 500,
    recurringPaymentType: "Monthly",
    totalOccupants: 1,
    notes: "",
    rent: 1000,
    collectionDay: 0,
    lastPaymentDate: "03/02/2021",
    nextPaymentDate: "03/05/2021",
  },
];

export const Expenses = [
  {
    id: 1,
    amount: 100,
    status: "paid",
    description: "",
    paidOn: "3/1/2021",
    paymentDue: "",
    recurring: false,
    additionalNotes: "",
    image: null,
    propertyId: 1,
    name: "Gas",
  },
  {
    id: 2,
    amount: 150,
    status: "paid",
    description: "",
    paidOn: "3/1/2021",
    paymentDue: "",
    recurring: false,
    additionalNotes: "",
    image: null,
    propertyId: 1,
    name: "Electricity",
  },
  {
    id: 3,
    amount: 50,
    status: "paid",
    description: "",
    paidOn: "3/1/2021",
    paymentDue: "",
    recurring: false,
    additionalNotes: "",
    image: null,
    propertyId: 1,
    name: "Water",
  },
  {
    id: 4,
    amount: 100,
    status: "paid",
    description: "",
    paidOn: "3/1/2021",
    paymentDue: "",
    recurring: false,
    additionalNotes: "",
    image: null,
    propertyId: 1,
    name: "Repairs",
  },
];

export const Notes = [
  {
    id: 1,
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    lastUpdated: "1/19/2021",
    createdOn: "1/11/2011",
  },
];

export const Properties = [
  {
    id: 1,
    propertyName: "My Awesome House Rental",
    propertyAddress: "1234 Liberty Avenue",
    notesId: 1, // notes object ID
    tenants: [4, 5],
    image: null,
    unitType: PropertyTypes[1],
    income: 1860,
    expenses: [1, 2, 3, 4],
    color: "#F2CC8F",
  },
  {
    id: 2,
    propertyName: "My Awesome Apartment Rental",
    propertyAddress: "567 Raven Court",
    notes: null,
    tenants: [1, 2, 3],
    image: "",
    unitType: PropertyTypes[0],
    income: 1000,
    expenses: [1, 2, 3, 4], // 500
    color: "#81B29A",
  },
  {
    id: 3,
    propertyName: "My Awesome Duplex",
    propertyAddress: "8793 Sudarland Blvd.",
    notes: null,
    tenants: [],
    image: "",
    unitType: PropertyTypes[2],
    income: 0,
    expenses: [1, 2, 3, 4], // 2000
    color: "#E29578",
  },
  {
    id: 4,
    propertyName: "My Awesome Townhouse",
    propertyAddress: "11888 Prince William St.",
    notes: null,
    tenants: [6, 7, 8, 9, 10],
    image: "",
    unitType: PropertyTypes[3],
    income: 1000,
    expenses: [1, 2, 3, 4], // 2500
    color: "#8ECAE6",
  },
];

export const User = {
  email: VALID_EMAIL,
  password: VALID_PASSWORD,
  phone: "1234567890",
  properties: Properties,
  firstName: "Albert",
};
