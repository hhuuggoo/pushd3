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

import numpy as np
data = np.random.random((100,4))
json_data = [{'w' : w, 'x':x, 'y':y, 'z':z} for w,x,y,z in zip(*data.T)]


rpcclient = bridgeutils.RPCClient(s, server.jqidentity)
rpcclient2 = bridgeutils.RPCClient(s3, server.d3identity)
jq = push.RemoteChain(rpcclient)
d3 = push.RemoteChain(rpcclient2)

d3.push.gridplot('body', 2, 2, 100, 100, 'chart')
d3.push.scatter('#chart_0_0', json_data, 'x', 'y', 'circle')
d3.push.scatter('#chart_1_0', json_data, 'y', 'z', 'circle')
d3.push.scatter('#chart_0_1', json_data, 'w', 'z', 'circle')
d3.push.scatter('#chart_1_1', json_data, 'w', 'w', 'circle')
d3.select('#chart_1_1').selectAll('circle').attr('r', 5)



