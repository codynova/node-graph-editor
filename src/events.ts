import { Events, DefaultEvents, Input, Output, Connection, Socket, Control, EngineData } from '../../node-graph-engine/dist';
import { EditorView, Mouse, Transform, ZoomSource } from './view';

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
        accumulate: boolean;
    };
    multiselectnode: {
        node: Node;
        accumulate: boolean;
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
        transform: Transform;
        x: number;
        y: number;
    };
    translated: void;
    zoom: {
        transform: Transform;
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
    mousemove: Mouse;
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