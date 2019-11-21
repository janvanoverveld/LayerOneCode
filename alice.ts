import {ADD,RES,BYE} from './Message';
import {comm} from './communication';

const hostAlice='localhost';
const portAlice=30001;
const hostBob='localhost';
const portBob=30002;
const value: ()=>number = ()=>Math.floor(Math.random() * 5);

async function startProtocol() {
   for(let i=0;i<5;i++) {
      const add:ADD = new ADD(value(),value());
      comm.send(hostBob, portBob, add );
      const res = <RES> await comm.recv();
      console.log(`Send an ADD to Bob with values ${add.value1} and ${add.value2}, received ${res.sum}`);
   }
   await comm.send( hostBob, portBob, new BYE() );
   console.log('the protocol stops for Alice');
   comm.terminate();
}

comm.start(portAlice);

startProtocol();