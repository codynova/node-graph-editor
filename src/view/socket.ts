import { Emitter, IO, Node } from 'node-graph-engine';
import { DefaultEditorEvents } from '../events';

const POSITION_SCALE_FACTOR = 0.5;

export class SocketView extends Emitter<DefaultEditorEvents> {
	constructor (
		public element: HTMLElement,
		public type: 'input' | 'output',
		public io: IO,
		public node: Node,
		emitter: Emitter<DefaultEditorEvents>,
	) {
		super(emitter);

		this.trigger('rendersocket', { element, [type]: this.io, socket: io.socket });
	}

	getPosition ({ position }: { position: number[] }): [number, number] {
		const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = this.element;
		return [ position[0] + offsetLeft + offsetWidth * POSITION_SCALE_FACTOR, position[1] + offsetTop + offsetHeight * POSITION_SCALE_FACTOR ];
	}
}