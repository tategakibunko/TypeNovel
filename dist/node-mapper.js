"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IdNodeMapper {
    visitTextNode(node) {
        return node;
    }
    visitAnnotNode(node) {
        return node;
    }
    visitBlockNode(node) {
        return node;
    }
}
exports.IdNodeMapper = IdNodeMapper;
class NodeWhiteSpaceCleaner extends IdNodeMapper {
    visitBlockNode(node) {
        return node
            .filterChildren(child => !(child.isTextNode() && child.isWhiteSpace()))
            .mapChildren(child => child.acceptNodeMapper(this));
    }
}
exports.NodeWhiteSpaceCleaner = NodeWhiteSpaceCleaner;
//# sourceMappingURL=node-mapper.js.map