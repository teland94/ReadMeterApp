export class Settings {
    communalServices: CommunalService[];
}

export class CommunalService {
    id: number;
    personalAccount: string;
    phoneNumber: string;
    category: CommunalServiceCategory;
}

export enum CommunalServiceCategory {
    Electricity = 'electricity',
    Gas = 'gas',
    Water = 'water'
}
