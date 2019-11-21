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

httpServer.listen(30002);

async function waitForMessage():Promise<any>{
   let promise = new Promise<any>( resolve => messageResolver = resolve );
   return promise;
}

async function sendMessage (host:string, port:number,msg:any):Promise<void> {
    let resolver: () => void;
    const promise:Promise<void> = new Promise( resolve => resolver = resolve );
    const httpInfo = { url: `http://${host}:${port}`
                 , headers: httpHeaders
                    , body: msg
                    , json: true };
    request.post( httpInfo, () => resolver() );
    return promise;
}

async function startProtocol() {
   let msg = await waitForMessage();
   while ( msg && msg.name !== "BYE" && msg.value1 && msg.value2 ) {
      console.log(`Received ${msg.value1} and ${msg.value2}`);
      const res = Number(msg.value1) + Number(msg.value2);
      await sendMessage('localhost', 30001, {name:"RES", sum:res} );
      msg = await waitForMessage();
   }
   console.log('the protocol stops for Bob');
   httpServer.close();
}

startProtocol();