# node-graph-engine

This project started as a fork of ReteJS (https://github.com/retejs/rete)

* Sockets are the attachment points for Connections, and handle Connection compatability

* Connections manage relationships between Inputs/Outputs

* IO contains Connections, as well as a reference to the Node and Socket

* Inputs/Outputs extend IO

* Inputs

* Outputs

* Nodes

* Controls manipulate data on Nodes or Inputs


The engine is simply an event emitter at its core