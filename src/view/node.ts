import { Emitter, Node, Component, IO, Control } from 'node-graph-engine';
import { DefaultEditorEvents } from '../events';
import { SocketView } from './socket';
import { ControlView } from './control';
import { Drag } from './drag';

export class NodeView extends Emitter<DefaultEditorEvents> {
	element: HTMLElement;
	sockets = new Map<IO, SocketView>();
	controls = new Map<Control, ControlView>();
	private startPosition: [number, number] = [ 0.0, 0.0 ];
	private drag: Drag;

	constructor (
		public node: Node,
		public component: Component,
		emitter: Emitter<DefaultEditorEvents>,
	) {
		super(emitter);
	}
}