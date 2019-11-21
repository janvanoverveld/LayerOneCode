import * as http from 'http';
import * as request from 'request';

const httpHeaders = {'cache-control':'no-cache','Content-Type':'application/json','charset':'utf-8'};

var   messageResolver: (msg: any) => void;
const waitForMessage:  ()=>Promise<any>    = async ():Promise<any> => new Promise<any>( resolve => messageResolver = resolve );
const startServer:     (port:number)=>void = (p) => httpServer.listen(p);
const terminateServer: ()=>void            = () => setTimeout( () => httpServer.close(), 5000 );

function httpRestServer(req:http.IncomingMessage,res:http.ServerResponse):void {
   if ( req.method === 'POST' ) {
      let body = '';
      req.on('data', (chunk:string) => body += chunk );
      req.on('end',  () => { //console.log(`bericht ontvangen  ${postData}`);
                             messageResolver(JSON.parse(body));
                             res.write("OK");
                             res.end(); } );
   } else res.writeHead(404, "page not found", httpHeaders);
}

const httpServer:http.Server = http.createServer(httpRestServer);

async function sendMessage (host:string, port:number,msg:any):Promise<void> {
    //console.log(`send ${msg.name} Message to ${host}:${port}`);
    let resolver: () => void;
    const promise:Promise<void> = new Promise( resolve => resolver = resolve );
    const httpInfo = { url: `http://${host}:${port}`, headers: httpHeaders, body: msg, json: true };
    request.post( httpInfo, () => resolver() );
    return promise;
}

const comm = {
    start: startServer
,   terminate:terminateServer
,   recv:waitForMessage
,   send:sendMessage
}


export {comm};
