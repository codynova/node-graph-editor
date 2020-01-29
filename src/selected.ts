import { Node } from 'node-graph-engine';

export class Selected {
	nodes = new Map<number, Node>();

	add (node: Node, accumulate = false) {
		if (!accumulate) {
			this.nodes.clear();
			this.nodes.set(node.id, node);
		}
		else if (!this.nodes.has(node.id)) {
			this.nodes.set(node.id, node);
		}
	}

	clear () {
		this.nodes.clear();
	}

	remove (node: Node) {
		this.nodes.delete(node.id);
	}

	contains (node: Node) {
		return this.nodes.has(node.id);
	}

	each (callback: (node: Node, index: number) => void) {
		this.nodes.forEach(callback);
	}
}