import * as http from 'http';
import * as request from 'request';

const httpHeaders = {'cache-control':'no-cache'
                     ,'Content-Type':'application/json'
                          ,'charset':'utf-8'};
var   messageResolver: (msg: any) => void;

const httpServer:http.Server = http.createServer(
  (req,res) => {
     let body = '';
     req.on('data', (chunk:string) => body += chunk );
     req.on('end',  () => { messageResolver(JSON.parse(body));
                            res.write("OK");
                            res.end(); } );
  }
);

httpServer.listen(30001);

async function waitForMessage():Promise<any>{
   let promise = new Promise<any>( resolve => messageResolver = resolve );
   return promise;
}

async function sendMessage (host:string, port:number,msg:any) {
    let resolver: () => void;
    const promise = new Promise( resolve => resolver = resolve );
    const httpInfo = { url: `http://${host}:${port}`
                 , headers: httpHeaders
                    , body: msg
                    , json: true };
    request.post( httpInfo, () => resolver() );
    return promise;
}

async function startProtocol() {
   const hostBob='localhost';
   const portBob=30002;
   for(let i=0;i<5;i++) {
      sendMessage(hostBob, portBob, {name:"ADD", value1:21, value2:21});
      const res = await waitForMessage();
      if (res && res.name === "RES" && res.sum)
         console.log(`Received ${res.sum}`);
   }
   await sendMessage( hostBob, portBob, { name:"BYE" } );
   console.log('the protocol stops for Alice');
   httpServer.close();
}

startProtocol();