export enum EditorError {
	ComponentNotFoundInView = 'Component not found in View. Component name: ',
	SocketNotFoundInView = 'Socket not found in View. IO name and key: ',
	ConnectionViewNotFound = 'ConnectionView not found',
	NodeNotFoundForConnectionIO = 'Connection IO not added to Node',
	NodeViewNotFoundForConnectionIO = 'NodeView not found for Connection IO',
	ContainerMissingParentElement = 'Container does not have a parent element',
	NodeNotFoundInEditor = 'Node not found in Editor. Node id: ',
	ComponentNotFoundInEditor = 'Component not found in Editor. Component name: ',
	ConnectionIONotFound = 'Connection IO not found for node. Node id: ',
}