
class RemoteChain(object):
    def __init__(self, rpcclient, commands=[], current_call='__call__'):
        self.rpc = rpcclient
        self.commands = commands
        
    def __getattr__(self, name):
        newcall = ['__getattr__', name] 
        newcommands = self.commands[:]
        newcommands.append(newcall)
        return self.__class__(self.rpc, commands=newcommands);

    def __call__(self, *args):
        newcall = ['__call__'] + list(args)
        newcommands = self.commands[:]
        newcommands.append(newcall)
        return self.__class__(self.rpc, commands=newcommands);
    
    def remote(self):
        self.rpc.rpc('execute', self.commands);
        
    def __repr__(self):
        self.remote()
        return str(self.commands);
    
            
