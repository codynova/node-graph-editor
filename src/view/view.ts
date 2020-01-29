import { Emitter, Component, Node, Connection } from 'node-graph-engine';
import { DefaultEditorEvents } from '../events';
import { NodeView } from './node';
import { ConnectionView } from './connection';
import { Area } from './area';
import { listener } from './listener';
import { EditorError } from '../errors';

export class EditorView extends Emitter<DefaultEditorEvents> {
	container: HTMLElement;
	components: Map<string, Component>;
	nodes = new Map<Node, NodeView>();
	connections = new Map<Connection, ConnectionView>();
	area: Area;

	constructor (container: HTMLElement, components: Map<string, Component>, emitter: Emitter<DefaultEditorEvents>) {
		super(emitter);

		this.container = container;
		this.components = components;
		this.container.style.overflow = 'hidden';
		this.container.addEventListener('click', this.click.bind(this));
		this.container.addEventListener('contextmenu', event => this.trigger('contextmenu', { event, view: this }));
		emitter.on('destroy', listener('resize', this.resize.bind(this)));
		emitter.on('destroy', () => this.nodes.forEach(view => view.destroy()));
		this.on('nodetranslated', this.updateConnections.bind(this));
		this.area = new Area(container, this);
		this.container.appendChild(this.area.element);
	}

	addNode (node: Node) {
		const component = this.components.get(node.name);

		if (!component) {
			throw new Error(EditorError.ComponentNotFound + node.name);
		}

		const nodeView = new NodeView(node, component, this);
		this.nodes.set(node, nodeView);
		this.area.appendChild(nodeView.element);
	}

	removeNode (node: Node) {
		const nodeView = this.nodes.get(node);
		this.nodes.delete(node);

		if (nodeView) {
			this.area.removeChild(nodeView.element);
			nodeView.destroy();
		}
	}

	addConnection (connection: Connection) {
		if (!connection.input.node || !connection.output.node) {
			throw new Error(EditorError.NodeNotFoundForConnectionIO);
		}

		const inputNodeView = this.nodes.get(connection.input.node);
		const outputNodeView = this.nodes.get(connection.output.node);

		if (!inputNodeView || !outputNodeView) {
			throw new Error(EditorError.NodeViewNotFoundForConnectionIO)
		}

		const connectionView = new ConnectionView(connection, inputNodeView, outputNodeView, this);
		this.connections.set(connection, connectionView);
		this.area.appendChild(connectionView.element);
	}

	removeConnection (connection: Connection) {
		const connectionView = this.connections.get(connection);
		this.connections.delete(connection);

		if (connectionView) {
			this.area.removeChild(connectionView.element);
		}
	}

	updateConnections ({ node }: { node: Node }) {
		node.getConnections().forEach(connection => {
			const connectionView = this.connections.get(connection);

			if (!connectionView) {
				throw new Error(EditorError.ConnectionViewNotFound);
			}

			connectionView.update();
		})
	}

	resize () {
		if (!this.container.parentElement) {
			throw new Error(EditorError.ContainerMissingParentElement);
		}

		const { clientWidth, clientHeight } = this.container.parentElement;
		this.container.style.width = clientWidth + 'px';
		this.container.style.height = clientHeight + 'px';
	}

	click (event: Event) {
		if (this.container !== event.target) {
			return;
		}

		if (!this.trigger('click', { event, container: this.container })) {
			return;
		}
	}
}