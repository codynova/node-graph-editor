import { Emitter, IO, Node } from 'node-graph-engine';
import { DefaultEditorEvents } from '../events';

const POSITION_SCALE_FACTOR = 0.5;

export class SocketView extends Emitter<DefaultEditorEvents> {
	element: HTMLElement;
	type: 'input' | 'output';
	io: IO;
	node: Node;

	constructor (
		element: HTMLElement,
		type: 'input' | 'output',
		io: IO,
		node: Node,
		emitter: Emitter<DefaultEditorEvents>,
	) {
		super(emitter);

		this.element = element;
		this.type = type;
		this.io = io;
		this.node = node;

		this.trigger('rendersocket', { element, [type]: this.io, socket: io.socket });
	}

	getPosition ({ position }: { position: number[] }): [number, number] {
		const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = this.element;
		return [ position[0] + offsetLeft + offsetWidth * POSITION_SCALE_FACTOR, position[1] + offsetTop + offsetHeight * POSITION_SCALE_FACTOR ];
	}
}