export class CodeRange {
  constructor(public startLine: number, public endLine: number) { }

  public isInside(line: number): boolean {
    return this.startLine <= line && line <= this.endLine;
  }
}