
export class Historico {
    public id: number;
   
    constructor( 
        public id_serv:String,
        public code:String,
        public titulo:String,
        public img:String,
        public card:String
        
    ) {
        this.id = new Date().getTime();
    } 
       
}
