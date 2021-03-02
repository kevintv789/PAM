export const VALID_EMAIL = "test@test.com";
export const VALID_PASSWORD = "test123";

export const PropertyTypes = [
  "Apartment/Condo",
  "Single Family",
  "Multi-Family",
  "Townhouse",
  "Other",
];

export const Properties = [
  {
    id: 1,
    propertyName: 'My Awesome House Rental',
    propertyAddress: '1234 Liberty Avenue',
    notes: '',
    tenants: [],
    image: null,
    unitType: PropertyTypes[1],
    income: 1860,
    expenses: 500,
    color: '#F2CC8F'
  },
  {
    id: 2,
    propertyName: 'My Awesome Apartment Rental',
    propertyAddress: '567 Raven Court',
    notes: '',
    tenants: [],
    image: '',
    unitType: PropertyTypes[0],
    income: 1000,
    expenses: 500,
    color: '#81B29A'
  },
  {
    id: 3,
    propertyName: 'My Awesome Duplex',
    propertyAddress: '8793 Sudarland Blvd.',
    notes: '',
    tenants: [],
    image: '',
    unitType: PropertyTypes[2],
    income: 5000,
    expenses: 2500,
    color: '#E29578'
  },
  {
    id: 4,
    propertyName: 'My Awesome Townhouse',
    propertyAddress: '11888 Prince William St.',
    notes: '',
    tenants: [],
    image: '',
    unitType: PropertyTypes[3],
    income: 1000,
    expenses: 2000,
    color: '#8ECAE6'
  },
];

export const User = {
  email: VALID_EMAIL,
  password: VALID_PASSWORD,
  phone: "1234567890",
  properties: Properties,
  firstName: "Albert",
};
