import { Context, Node, Output, Input, Connection, EngineData } from 'node-graph-engine';
import { DefaultEditorEvents } from './events';
import { Selected } from './selected';
import { EditorView } from './view';
import { EditorEvents } from './events';
import { EditorComponent } from './component';
import { listener } from './listener';
import { EditorError } from './errors';

export class NodeEditor extends Context<DefaultEditorEvents> {
	nodes = new Map<number, Node>();
	selected = new Selected();
	view: EditorView;

	constructor (id: string, container: HTMLElement) {
		super(id, new EditorEvents());

		this.view = new EditorView(container, this.components, this);
		this.on('destroy', listener('keydown', event => this.trigger('keydown', event)));
		this.on('destroy', listener('keyup', event => this.trigger('keyup', event)));
		this.on('selectnode', ({ node, allowMultipleSelected }) => this.selectNode(node, allowMultipleSelected));
		
		this.on('nodeselected', () => this.selected.each(node => {
			const nodeView = this.view.nodes.get(node);

			if (nodeView) {
				nodeView.onStart();
			}
		}));

		this.on('translatenode', ({ dx, dy }) => this.selected.each(node => {
			const nodeView = this.view.nodes.get(node);

			if (nodeView) {
				nodeView.onDrag(dx, dy);
			}
		}));
	}

	addNode (node: Node) {
		if (!this.trigger('nodecreate', node)) {
			return;
		}

		this.nodes.set(node.id, node);
		this.view.addNode(node);
		this.trigger('nodecreated', node);
	}

	removeNode (node: Node) {
		if (!this.trigger('noderemove', node)) {
			return;
		}

		node.getConnections().forEach(connection => this.removeConnection(connection));
		this.nodes.delete(node.id);
		this.view.removeNode(node);
		this.trigger('noderemoved', node);
	}

	// TO DO: change data to a Map
	connect (input: Input, output: Output, data: unknown = {}) {
		if (!this.trigger('connectioncreate', { output, input })) {
			return;
		}

		try {
			const connection = output.connectTo(input);
			connection.data = data;
			this.view.addConnection(connection);
			this.trigger('connectioncreated', connection);
		}
		catch (error) {
			this.trigger('warn', error);
		}
	}

	removeConnection (connection: Connection) {
		if (!this.trigger('connectionremove', connection)) {
			return;
		}

		this.view.removeConnection(connection);
		connection.remove();
		this.trigger('connectionremoved', connection);
	}

	selectNode (node: Node, allowMultipleSelected: boolean = false) {
		if (!this.nodes.has(node.id)) {
			throw new Error(EditorError.NodeNotFoundInEditor + node.id);
		}

		if (!this.trigger('nodeselect', node)) {
			return;
		}

		this.selected.add(node, allowMultipleSelected);
		this.trigger('nodeselected', node);
	}

	getComponent (name: string) {
		const component = this.components.get(name);

		if (!component) {
			throw new Error(EditorError.ComponentNotFoundInEditor + name);
		}

		return component;
	}

	register (component: EditorComponent) {
		super.register(component);
		component.editor = this;
	}

	clear () {
		for (const node of this.nodes.values()) {
			this.removeNode(node);
		}
		this.trigger('clear');
	}


	// TO DO: finish this
	toJSON () {}

	beforeImport (json: EngineData) {}

	afterImport () {}

	async fromJSON (json: EngineData) {}
}