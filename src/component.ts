import { Component, Node } from 'node-graph-engine';
import { NodeEditor } from './editor';

export abstract class EditorComponent extends Component {
    editor: NodeEditor | null = null;
    data = new Map<string, unknown>();

    constructor (name: string) {
        super(name);
    }

    abstract async builder (node: Node): Promise<void>;

    async build (node: Node) {
        await this.builder(node);
        return node;
    }

    async createNode (data = new Map<string, unknown>()) {
        const node = new Node(this.name);
        node.data = data;
        await this.build(node);
        return node;
    }
}