export class ReadMeterResult {
    meterCategory: string;
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
