import { Emitter, Connection } from 'node-graph-engine';
import { DefaultEditorEvents } from '../events';
import { NodeView } from './node';

export class ConnectionView extends Emitter<DefaultEditorEvents> {
	connection: Connection;
	inputNode: NodeView;
	outputNode: NodeView;
	element: HTMLElement;

	constructor (
		connection: Connection,
		inputNode: NodeView,
		outputNode: NodeView,
		emitter: Emitter<DefaultEditorEvents>,
	) {
		super(emitter);

		this.connection = connection;
		this.inputNode = inputNode;
		this.outputNode = outputNode;
		this.element = document.createElement('div');
		this.element.style.position = 'absolute';
		this.element.style.zIndex = '-1';

		this.trigger('renderconnection', { element: this.element, connection: this.connection, points: this.getPoints() });
	}

	getPoints () {
		return [
			...this.outputNode.getSocketPosition(this.connection.output),
			...this.inputNode.getSocketPosition(this.connection.output)
		];
	}

	update () {
		this.trigger('updateconnection', { element: this.element, connection: this.connection, points: this.getPoints() });
	}
}