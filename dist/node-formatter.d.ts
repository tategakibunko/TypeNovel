import { TnNode } from './modules';
export interface NodeFormatter {
    visitTextNode: (args: {
        content: string;
        isWhiteSpacePre: boolean;
        isFirstChild: boolean;
        isLastChild: boolean;
        prev?: TnNode;
        next?: TnNode;
        indent: number;
    }) => string;
    visitAnnotNode: (args: {
        name: string;
        tagName: string;
        id: string;
        className: string;
        attrs: any;
        args: any[];
        content: string;
        selfClosing: boolean;
        prev?: TnNode;
        next?: TnNode;
        indent: number;
    }) => string;
    visitBlockNode: (args: {
        name: string;
        tagName: string;
        id: string;
        className: string;
        attrs: any;
        args: any[];
        content?: string;
        children: TnNode[];
        prev?: TnNode;
        next?: TnNode;
        indent: number;
    }) => string;
}
export declare class StdHtmlFormatter implements NodeFormatter {
    visitTextNode(args: {
        content: string;
        isFirstChild: boolean;
        isLastChild: boolean;
        isWhiteSpacePre: boolean;
        prev?: TnNode;
        next?: TnNode;
        indent: number;
    }): string;
    visitAnnotNode(args: {
        name: string;
        tagName: string;
        id: string;
        className: string;
        attrs: any;
        args: any[];
        content: string;
        selfClosing: boolean;
        prev?: TnNode;
        next?: TnNode;
        indent: number;
    }): string;
    visitBlockNode(args: {
        name: string;
        tagName: string;
        id: string;
        className: string;
        attrs: any;
        args: any[];
        children: TnNode[];
        content?: string;
        prev?: TnNode;
        next?: TnNode;
        indent: number;
    }): string;
}
export declare class MinifiedHtmlFormatter extends StdHtmlFormatter {
    visitBlockNode(args: {
        name: string;
        tagName: string;
        id: string;
        className: string;
        attrs: any;
        args: any[];
        children: TnNode[];
        content?: string;
        prev?: TnNode;
        next?: TnNode;
        indent: number;
    }): string;
}
export declare class PlainTextFormatter extends StdHtmlFormatter {
    visitBlockNode(args: {
        name: string;
        tagName: string;
        id: string;
        className: string;
        attrs: any;
        args: any[];
        children: TnNode[];
        content?: string;
        prev?: TnNode;
        next?: TnNode;
        indent: number;
    }): string;
}
