import { Events, DefaultEvents, Node, Input, Output, Connection, Socket, Control, EngineData } from 'node-graph-engine';
import { EditorView, MouseData, TransformData, ZoomSource } from './view';

// TO DO: finish this, figure out how to structure EditorEvent types...

// enum EditorEventTypes {
//     NodeCreate = 'nodecreate',
//     NodeCreated = 'nodecreated',
//     NodeRemove = 'noderemove',
//     NodeRemoved = 'noderemoved',
//     ConnectionCreate = 'connectioncreate',
//     ConnectionCreated = 'connectioncreated',
//     ConnectionRemove = 'connectionremove',
//     ConnectionRemoved = 'connectionremoved',
//     TranslateNode = 'translatenode',
//     NodeTranslate = 'nodetranslate',
//     NodeTranslated = 'nodetranslated',
//     NodeDragged = 'nodedragged',
//     SelectNode = 'selectnode',
//     MultiSelectNode = 'multiselectnode',
//     NodeSelect = 'nodeselect',
//     NodeSelected = 'nodeselected',
//     RenderNode = 'rendernode',
//     RenderSocket = 'rendersocket',
//     RenderControl = 'rendercontrol',
//     RenderConnection = 'renderconnection',
//     UpdateConnection = 'updateconnection',
//     KeyDown = 'keydown',
//     KeyUp = 'keyup',
//     Translate = 'translate',
//     Translated = 'translated',
//     Zoom = 'zoom',
//     Zoomed = 'zoomed',
//     Click = 'click',
//     MouseMove = 'mousemove',
//     ContextMenu = 'contextmenu',
//     Import = 'import',
//     Export = 'export',
//     Process = 'process',
//     Clear = 'clear',
// }

export interface DefaultEditorEvents extends DefaultEvents {
	nodecreate: Node;
	nodecreated: Node;
	noderemove: Node;
	noderemoved: Node;
	connectioncreate: {
		input: Input;
		output: Output;
	};
	connectioncreated: Connection;
	connectionremove: Connection;
	connectionremoved: Connection;
	translatenode: {
		node: Node;
		dx: number;
		dy: number;
	};
	nodetranslate: {
		node: Node;
		x: number;
		y: number;
	};
	nodetranslated: {
		node: Node;
		prev: [ number, number ];
	};
	nodedragged: Node;
	selectnode: {
		node: Node;
		allowMultipleSelected: boolean;
	};
	multiselectnode: {
		node: Node;
		allowMultipleSelected: boolean;
		event: MouseEvent;
	};
	nodeselect: Node;
	nodeselected: Node;
	rendernode: {
		element: HTMLElement;
		node: Node;
		component: object;
		bindSocket: Function;
		bindControl: Function;
	};
	rendersocket: {
		element: HTMLElement;
		input?: Input;
		output?: Output;
		socket: Socket;
	};
	rendercontrol: {
		element: HTMLElement;
		control: Control;
	};
	renderconnection: {
		element: HTMLElement;
		connection: Connection;
		points: number[];
	};
	updateconnection: {
		element: HTMLElement;
		connection: Connection;
		points: number[];
	};
	keydown: KeyboardEvent;
	keyup: KeyboardEvent;
	translate: {
		transform: TransformData;
		x: number;
		y: number;
	};
	translated: void;
	zoom: {
		transform: TransformData;
		zoom: number;
		source: ZoomSource;
	};
	zoomed: {
		source: ZoomSource;
	};
	click: {
		event: Event;
		container: HTMLElement;
	};
	mousemove: MouseData;
	contextmenu: {
		event: MouseEvent;
		view?: EditorView;
		node?: Node;
	};
	import: EngineData;
	export: EngineData;
	process: void;
	clear: void;
}

type DefaultEditorEventKeys = Exclude<keyof DefaultEditorEvents, keyof DefaultEvents>

const EDITOR_EVENTS: Record<DefaultEditorEventKeys, Function[]> = {
	nodecreate: [],
	nodecreated: [],
	noderemove: [],
	noderemoved: [],
	connectioncreate: [],
	connectioncreated: [],
	connectionremove: [],
	connectionremoved: [],
	translatenode: [],
	nodetranslate: [],
	nodetranslated: [],
	nodedragged: [],
	selectnode: [],
	multiselectnode: [],
	nodeselect: [],
	nodeselected: [],
	rendernode: [],
	rendersocket: [],
	rendercontrol: [],
	renderconnection: [],
	updateconnection: [],
	keydown: [],
	keyup: [],
	translate: [],
	translated: [],
	zoom: [],
	zoomed: [],
	click: [],
	mousemove: [],
	contextmenu: [],
	import: [],
	export: [],
	process: [],
	clear: [],
}

export class EditorEvents extends Events {
	constructor () {
		super(new Map(Object.entries(EDITOR_EVENTS) as [DefaultEditorEventKeys, Function[]][]));
	}
}