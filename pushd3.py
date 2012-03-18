
class RemoteD3(object):
    def __init__(self, rpcclient, commands=[], current_call='__call__'):
        self.rpc = rpcclient
        self.commands = commands
        self.current_call = current_call
        
    def __getattr__(self, name):
        return RemoteD3(self.rpc,
                        commands=self.commands[:],
                        current_call=name);

    def __call__(self, *args):
        newcall = [self.current_call] + list(args)
        newcommands = self.commands[:]
        newcommands.append(newcall)
        return RemoteD3(self.rpc,
                        commands=newcommands,
                        current_call=self.current_call)

    def remote(self):
        self.rpc.rpc('execute', self.commands);
        
    def __repr__(self):
        self.remote()
        return str(self.commands);
    
            
