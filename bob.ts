import {Message,ADD,RES,BYE} from './Message';
import {comm} from './communication';

const hostAlice='localhost';
const portAlice=30001;
const hostBob='localhost';
const portBob=30002;

async function startProtocol() {
   let msg = <Message> await comm.recv();
   while ( msg && msg.name === ADD.name ) {
      const add:ADD = <ADD>msg;
      const res = new RES(add.value1+add.value2);
      comm.send(hostAlice, portAlice, res );
      console.log(`An ADD received with ${add.value1} and ${add.value2}, send a RES with ${res.sum} back`);
      msg = <Message> await comm.recv();
   }
   console.log('the protocol stops for Bob');
   comm.terminate();
}

comm.start(portBob);

startProtocol();

console.log(`bob is gestart  ${new Date()}`);