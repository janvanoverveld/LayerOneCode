abstract class Message {
    constructor(public name:string){};
}

class ADD extends Message{
    constructor(public value1:number, public value2:number){
        super(ADD.name);
    }
}

class RES extends Message {
    constructor(public sum:number){
        super(RES.name);
    }
}

class BYE extends Message {
    constructor(){
        super(BYE.name);
    }
}

export {Message, ADD, RES, BYE}