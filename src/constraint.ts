import { CodePos } from './modules';

export class Constraint {
  public key: string;
  public value: any;
  public codePos: CodePos;

  constructor(key: string, value: any, codePos: CodePos) {
    this.key = key;
    this.value = value;
    this.codePos = codePos;
  }

  isIgnoredConstraint(): boolean {
    return String(this.value).startsWith('?');
  }
}

export class ConstraintCollection {
  private constraints: Constraint[];

  constructor(constraints: Constraint[]) {
    // convert constraint[] in constraint to 'object'.
    this.constraints = constraints.map(cntr => {
      if (cntr instanceof Array && cntr[0] instanceof Constraint) {
        console.log('constraint to object');
        return new ConstraintCollection(cntr).object;
      }
      return cntr;
    })
  }

  get(name: string): Constraint | undefined {
    return this.constraints.find(c => c.key === name);
  }

  containsKey(key: string): boolean {
    return this.constraints.some(c => c.key === key);
  }

  filter(fn: (cntr: Constraint) => boolean): Constraint[] {
    return this.constraints.filter(cntr => fn(cntr));
  }

  forEach(fn: (cntr: Constraint) => void) {
    this.constraints.forEach(cntr => fn(cntr));
  }

  get length(): number {
    return this.constraints.length;
  }

  get object(): any {
    return this.constraints.reduce((acm: any, cntr) => {
      acm[`${cntr.key}`] = cntr.value;
      return acm;
    }, {});
  }

  get attrs(): any {
    return this.constraints.reduce((acm: any, cntr) => {
      acm[`data-${cntr.key}`] = String(cntr.value);
      return acm;
    }, {});
  }

  get keys(): string[] {
    return this.constraints.map(c => c.key);
  }

  get values(): any[] {
    return this.constraints.map(c => c.value);
  }
}