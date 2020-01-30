import { NodeEditor } from '../src';

const init = async () => {
    const parent = document.createElement('div');
    const container = document.createElement('div');
    parent.appendChild(container);
    const editor = new NodeEditor('test@0.0.1', container);
    editor.events.set('warn', []);
    editor.events.set('error', []);
    document.body.appendChild(parent);
};

init();