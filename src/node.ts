import {
  BlockNode,
  NodeMapper,
  NodeFormatter,
  NodeValidator,
  ValidationError,
} from './modules';

export abstract class TnNode {
  public name = '';
  public uniqueId = 0;
  public parent?: BlockNode;
  public abstract acceptNodeMapper(visitor: NodeMapper): TnNode;
  public abstract acceptNodeFormatter(visitor: NodeFormatter, indent: number): string;
  public abstract acceptNodeValidator(visitor: NodeValidator): ValidationError[];
  public abstract toString(): string;

  public isTextNode(): boolean {
    return false;
  }

  public isAnnotNode(): boolean {
    return false;
  }

  public isBlockNode(): boolean {
    return false;
  }

  public get next(): TnNode | undefined {
    if (this.parent) {
      return this.parent.getChild(this.index + 1);
    }
    return undefined;
  }

  public get prev(): TnNode | undefined {
    if (this.parent) {
      return this.parent.getChild(this.index - 1);
    }
    return undefined;
  }

  public get index(): number {
    return this.parent ? this.parent.getIndexOfChild(this) : 0;
  }

  public get nth(): number {
    return this.index + 1;
  }

  public get indexOfType(): number {
    if (!this.parent) {
      return 0;
    }
    return this.parent.getIndexOfType(this);
  }

  public isFirstChild(): boolean {
    return this.index === 0;
  }

  public isLastChild(): boolean {
    return this.parent ? this.index === this.parent.getChildCount() - 1 : true;
  }

  protected evalAttrValue(value: string, args: any[]): string {
    const index = this.index;
    const indexOfType = this.indexOfType;
    return value
      .replace(/<name>/g, this.name)
      .replace(/<arg(\d)>/g, (_, p1) => String(args[parseInt(p1) - 1] || ''))
      .replace(/<index>/g, String(index))
      .replace(/<indexOfType>/g, String(indexOfType))
      .replace(/<nth>/g, String(index + 1))
      .replace(/<nthOfType>/g, String(indexOfType + 1))
      .replace(/<uniqueId>/g, String(this.uniqueId))
      .trim();
  }

  protected evalAttrs(name: string, args: any[], mapAttrs: any): any {
    return Object.keys(mapAttrs).reduce((acm: any, key: string) => {
      acm[key] = this.evalAttrValue(mapAttrs[key], args);
      return acm;
    }, {});
  }
}
