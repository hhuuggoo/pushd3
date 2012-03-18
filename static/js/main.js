var ctx = new zmq.Context('ws://localhost:8000');
var req = ctx.Socket(zmq.REQ);
var jqrep = ctx.Socket(zmq.REP);
var d3rep = ctx.Socket(zmq.REP);
var client_id = zmq.uuid();
req.connect('tcp://127.0.0.1:9000', {});
jqrep.connect('tcp://127.0.0.1:9001', {});
d3rep.connect('tcp://127.0.0.1:9001', {});
var rpc_client = new zmq.RPCClient(req);
rpc_client.rpc('jqident', [jqrep.identity], {}, function(){})
rpc_client.rpc('d3ident', [d3rep.identity], {}, function(){})

var RemoteChain = function(socket, initial_obj){
    zmq.RPCServer.call(this, socket);
    this.initial_obj = initial_obj;
}
RemoteChain.prototype = new zmq.RPCServer();
RemoteChain.echo = function(x){
    return x
}
RemoteChain.prototype.execute = function(commands){
    var lastval = this.initial_obj;
    var caller = this;
    var funcname, args
    var that = this;
    _.each(commands, function(command){
	funcname = command[0];
	args = command.slice(1);
	console.log([funcname, args]);
	var temp = lastval;
	if (funcname === '__getattr__'){
	    lastval = lastval[args[0]];
	}else if (funcname === '__call__'){
	    lastval = lastval.apply(caller, args);
	}
	caller = temp;
    });
    return 'success'
}
var JQRPC = function(socket){
    RemoteChain.call(this, socket, $);
}
JQRPC.prototype = new RemoteChain();

var D3RPC = function(socket){
    RemoteChain.call(this, socket, d3);
}
D3RPC.prototype = new RemoteChain();

var jqrpc = new JQRPC(jqrep);
var d3rpc = new D3RPC(d3rep);
