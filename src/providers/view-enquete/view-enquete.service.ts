import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { View } from '../../models/view.model';
import { SqliteHelperService } from '../sqlite-helper/sqlite-helper.service';
/*
  Generated class for the ViewEnqueteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ViewEnqueteService {
  private db: SQLiteObject;
  private isFirstCall: boolean = true;
  private isUpdate : Number;
  constructor(public sqliteHelperService: SqliteHelperService,) {
    console.log('Hello ViewEnqueteProvider Provider');
  }
  getDb(): Promise<SQLiteObject> {
    
    if (this.isFirstCall) {
      this.isFirstCall=false;
      return this.sqliteHelperService.getDb('cliente.db',this.isFirstCall)
        .then((db: SQLiteObject) => {
          
          this.db = db;
  
          this.db.executeSql
          ('CREATE TABLE IF NOT EXISTS view (id INTEGER PRIMARY KEY AUTOINCREMENT,code_id TEXT,ask_id TEXT,data TEXT,dataExp TEXT)', [])
            .then(success => console.log('view table created successfully!', success))
            .catch((error: Error) => console.log('Error creating movie table!', error));
        
               return this.db; 
      
      
         
        }); 
                
     
    }
    return this.sqliteHelperService.getDb();
  }

  getAll(orderBy?: string): Promise<View[]> {
    return this.getDb()
      .then((db: SQLiteObject) => {

        return <Promise<View[]>>this.db.executeSql('SELECT * FROM view ;',[])
          .then(resultSet => {

            let list: View[] = [];

            for (let i = 0; i < resultSet.rows.length; i++) {
              list.push(resultSet.rows.item(i));
            }

            return list;
          }).catch((error: Error) => console.log('Error executing method getAll!', error));

      });
  }

  create(view: View): Promise<View> {
    console.log('cadastro',view.code_id,view.ask_id,view.data);
    return <Promise<View>>this.db.executeSql('INSERT INTO view (code_id,ask_id,data,dataExp) VALUES (?,?,?,?)', [view.code_id,view.ask_id,view.data,view.dataExp])
      .then(resultSet => {
        view.id = resultSet.insertId;
        return view;
      }).catch((error: Error) => console.log(`Error creating '${view.code_id}' movie!`, error));
  }

  delete(ask_id: number): Promise<boolean> {
    return <Promise<boolean>>this.db.executeSql('DELETE FROM view WHERE ask_id=?', [ask_id])
      .then(resultSet => resultSet.rowsAffected > 0)
      .catch((resultSet =>-1));
  }

  getById(ask_id:Number): Promise<Number> {
    return <Promise<Number>>this.db.executeSql('SELECT ask_id FROM view WHERE  ask_id', [ask_id])
      .then(resultSet =>
        ( resultSet.rows.item(0).ask_id))
      .catch((resultSet =>-1));
  }
}
