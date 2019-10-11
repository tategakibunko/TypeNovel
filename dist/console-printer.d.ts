import { ValidationError } from './modules';
export interface ConsolePrinter {
    printOutput: (output: string) => void;
    printValidationError: (error: ValidationError) => void;
}
export declare class StdConsolePrinter implements ConsolePrinter {
    printOutput(output: string): void;
    printValidationError(error: ValidationError): void;
}
