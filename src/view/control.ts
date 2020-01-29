import { Emitter, Control } from 'node-graph-engine';
import { DefaultEditorEvents } from '../events';

export class ControlView extends Emitter<DefaultEditorEvents> {
	constructor (
		element: HTMLElement,
		control: Control,
		emitter: Emitter<DefaultEditorEvents>
	) {
		super(emitter);

		this.trigger('rendercontrol', { element, control });
	}
}