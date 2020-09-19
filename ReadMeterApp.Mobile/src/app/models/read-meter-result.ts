export class ReadMeterResult {
    meterCategory: MeterCategory;
    displayType: string;
    messages: Message[];
    displayValue: string;
}

export class Message {
    code: string;
    messageId: string;
    messageText: string;
    objectId: string;
}

export enum MeterCategory {
    Electricity = 'electricity',
    Gas = 'gas',
    Water = 'water'
}
