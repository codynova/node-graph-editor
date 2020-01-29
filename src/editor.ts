import { Context } from 'node-graph-engine';
import { DefaultEditorEvents } from './events';
import { Selected } from './selected';
import { EditorView } from './view';

export class NodeEditor extends Context<DefaultEditorEvents> {
	nodes = new Map<number, Node>();
	selected = new Selected();
	view: EditorView;
}