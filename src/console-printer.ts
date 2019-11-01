import { ValidationError } from './modules';

export interface ConsolePrinter {
  printOutput: (output: string) => void;
  printValidationError: (error: ValidationError) => void;
}

export class StdConsolePrinter implements ConsolePrinter {
  public printOutput(output: string) {
    console.log(output);
  }

  public printValidationError(error: ValidationError) {
    const pos = error.codePos;
    const path = pos.path ? `${pos.path} ` : '';
    console.error(`${path}line:${error.codePos.line + 1}, col:${error.codePos.startColumn}, ${error.message}`);
  }
}
