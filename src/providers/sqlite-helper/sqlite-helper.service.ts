import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";

@Injectable()
export class SqliteHelperService {

  private db: SQLiteObject;

  constructor(
    public platform: Platform,
    public sqlite: SQLite
  ) {}
  public dropDatabase(){
     this.sqlite.deleteDatabase({name: 'cliente.db', location: 'default'});
  }
  private createDatabase(dbName?: string): Promise<SQLiteObject> {

    return this.platform.ready()
      .then((readySource: string) => {
       // this.dropDatabase();
        return this.sqlite.create({
          name: dbName || 'cliente.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          this.db = db;
          return this.db;
        }).catch((error: Error) => {
         
          return Promise.reject(error.message || error);
        });

      });
  }

  getDb(dbName?: string, newOpen?: boolean): Promise<SQLiteObject> {
    if (newOpen) return this.createDatabase(dbName);
    return (this.db) ? Promise.resolve(this.db) : this.createDatabase(dbName);
  }

}
