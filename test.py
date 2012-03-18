import zmq
import logging
logging.basicConfig(level=logging.DEBUG)
import bridge.bridgeutils as bridgeutils
import push
import threading

c = zmq.Context()

s = c.socket(zmq.XREQ)
s.connect('tcp://127.0.0.1:9001')
s3 = c.socket(zmq.XREQ)
s3.connect('tcp://127.0.0.1:9001')

s2 = c.socket(zmq.REP)
s2.bind('tcp://127.0.0.1:9000')
class Server(bridgeutils.RPCServer):
    def jqident(self, ident):
        print 'jqident', ident
        self.jqidentity = ident
        
    def d3ident(self, ident):
        print 'd3ident', ident
        self.d3identity = ident
        
server = Server(s2)
t = threading.Thread(target=server.run_rpc)
t.start()

rpcclient = bridgeutils.RPCClient(s, server.jqidentity)
rpcclient2 = bridgeutils.RPCClient(s3, server.d3identity)
jq = push.RemoteChain(rpcclient)
d3 = push.RemoteChain(rpcclient2)

jq('body').css({'background-color' : 'white'})
jq('#chart').height(500)
jq('#chart').width(500)

svg = d3.select('#chart').append('svg')


import numpy as np
data = np.random.random((100,2))
json_data = [{'x':x, 'y':y} for x,y in zip(*data.T)]
svg.selectAll('circle').data(json_data).enter().append('circle')
circle.attr('cx'




