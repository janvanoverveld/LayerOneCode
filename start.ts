import * as child from 'child_process';
import * as fs from 'fs';

const logDir = './log';

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

function writeLogFile(fileName:string,data:string){
    const logFileName=`${__dirname}/../log/${fileName.substr(0,fileName.indexOf('.'))}.log`;
    fs.writeFile( logFileName
    ,             data
    ,             (err) => { if(err) { console.log(`fs error bij ${fileName}`);
                                       console.log(`${err}`); }
                             else {
                                //console.log(`logfile ${logFileName}  for ${fileName} was created`);
                                console.log(`${fileName}`);
                                process.stdout.write(data);  
                             }
                           } );
}

function executeNodeProcess(fileName:string){
    //console.log(`start ${fileName}   ${new Date()} `);
    const parameters = [`${__dirname}/${fileName}`];
    child.execFile( 'node'
    , parameters
    , (err,data) => { if (err){
                         console.log(`error bij ${fileName}`);
                         console.log(`${err}`);
                         writeLogFile(fileName,err.message);
                      }
                         else writeLogFile(fileName,data);
                    } );
    //console.log(`eind executeNodeProcess ${fileName}`);
};

global.setTimeout( () => executeNodeProcess( 'bob.js'   ), 1  );
global.setTimeout( () => executeNodeProcess( 'alice.js' ), 1000 );