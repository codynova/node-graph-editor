export enum EditorError {
	ComponentNotFound = 'Component not found with name: ',
	SocketNotFound = 'Socket not found for IO with name and key: ',
	ConnectionViewNotFound = 'Connection view not found',
	NodeNotFoundForConnectionIO = 'Connection IO not added to node',
	NodeViewNotFoundForConnectionIO = 'NodeView not found for Connection IO',
	ContainerMissingParentElement = 'Container does not have a parent element',
}