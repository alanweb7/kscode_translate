
export class View {
    public id: number;
   
    constructor( 
        public code_id:String,
        public ask_id :String,
        public data   :String,
        public dataExp : String
        
    ) {
        this.id = new Date().getTime();
    } 
       
}
