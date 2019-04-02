import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { Usuario } from './../../models/usuario.model';
import { SqliteHelperService } from '../sqlite-helper/sqlite-helper.service';

@Injectable()
export class UsuarioService {

  private db: SQLiteObject;
  private isFirstCall: boolean = true;

  constructor(
    public sqliteHelperService: SqliteHelperService
  ) {}

   getDb(): Promise<SQLiteObject> {
    if (this.isFirstCall) {

      this.isFirstCall = false;

       return this.sqliteHelperService.getDb('cliente.db')
        .then((db: SQLiteObject) => {

          this.db = db;

          this.db.executeSql
          ('CREATE TABLE IF NOT EXISTS cliente (id INTEGER PRIMARY KEY AUTOINCREMENT,  id_serv TEXT,name TEXT,sobrenome TEXT, email TEXT,photo TEXT,tp_pessoa TEXT,cpf TEXT,cnpj TEXT,nome_empresa,segmento_empresa,cep TEXT, endereco TEXT, numero TEXT, complemento TEXT,bairro TEXT, cidade TEXT,estado TEXT,telefone TEXT,celular TEXT,usuario TEXT,logado TEXT,token TEXT)', [])
            .then(success => console.log('Cliente table created successfully!', success))
            .catch((error: Error) => console.log('Error creating movie table!', error));
             return this.db;

        }); 

    }
    return this.sqliteHelperService.getDb();
  }
  getAll(orderBy?: string): Promise<Usuario[]> {
    return this.getDb()
      .then((db: SQLiteObject) => {

        return <Promise<Usuario[]>>this.db.executeSql('SELECT * FROM cliente WHERE logado=? LIMIT 1 ;', ["1"])
          .then(resultSet => {

            let list: Usuario[] = [];

            for (let i = 0; i < resultSet.rows.length; i++) {
              list.push(resultSet.rows.item(i));
            }

            return list;
          }).catch((error: Error) => console.log('Error executing method getAll!', error));

      });
  }

  create(movie: Usuario): Promise<Usuario> {
    return <Promise<Usuario>>this.db.executeSql('INSERT INTO cliente (id_serv,name,sobrenome,email ,photo ,tp_pessoa ,cpf ,cnpj ,cep , endereco , numero , complemento ,bairro , cidade ,estado ,telefone ,celular ,usuario ,logado,token) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [movie.id_serv,movie.name,movie.sobrenome, movie.email ,movie.photo ,movie.tp_pessoa ,movie.cpf ,movie.cnpj ,movie.cep , movie.endereco , movie.numero , movie.complemento ,movie.bairro , movie.cidade ,movie.estado ,movie.telefone ,movie.celular ,movie.usuario,movie.logado,movie.token])
      .then(resultSet => {
        movie.id = resultSet.insertId;
        return movie;
      }).catch((error: Error) => console.log(`Error creating '${movie.sobrenome}' movie!`, error));
  }

  update(name:String,sobrenome:String, email:String ,photo:String ,telefone :String,celular ,logado:String,token:String,id_serv:Number): Promise<boolean> {
     return <Promise<boolean>>this.db.executeSql('UPDATE cliente SET name=?,sobrenome=?,email=?,photo=?,telefone=?,celular=?,logado=?,token=? WHERE id_serv=?', [name,sobrenome,email,photo,telefone,celular,logado,token,id_serv])
      .then(resultSet => resultSet.rowsAffected >= 0)
      .catch((error: Error) => console.log(`Error updating ${name} movie!`, error)); 
  }
  update_Endereco(nome_empresa:String,segmento_empresa:String,user_cep:String,cidade_empresa:String,estado_empresa:String,id_serv:Number){
     return <Promise<boolean>>this.db.executeSql('UPDATE cliente SET nome_empresa=?,segmento_empresa=?,cep=?,cidade=?,estado=? WHERE id_serv=?', [nome_empresa,segmento_empresa,user_cep,cidade_empresa,estado_empresa,id_serv])
      .then(resultSet => resultSet.rowsAffected >= 0)
      .catch((error: Error) => console.log(`Error updating endereco ${nome_empresa} movie!`, error)); 

  }

  delete(id: number): Promise<boolean> {
    return <Promise<boolean>>this.db.executeSql('DELETE FROM cliente WHERE id=?', [id])
      .then(resultSet => resultSet.rowsAffected > 0)
      .catch((resultSet =>-1));
  }

  getById(id_serv: Number): Promise<Number> {
    return <Promise<Number>>this.db.executeSql('SELECT id_serv FROM cliente WHERE id_serv=?', [id_serv])
      .then(resultSet =>
        ( resultSet.rows.item(0).id_serv))
      .catch((resultSet =>-1));
  }
  getByUser(usuario: Number): Promise<Number> {
    return <Promise<Number>>this.db.executeSql('SELECT usuario FROM cliente WHERE usuario=?', [usuario])
      .then(resultSet =>
        ( resultSet.rows.item(0).id_serv))
      .catch((resultSet =>-1));
  }
  getByToken(token: String): Promise<Usuario> {
    return this.db.executeSql('SELECT * FROM cliente WHERE token=?', [token])
      .then(resultSet => resultSet.rows.item(0))
      .catch((error: Error) => console.log(`Error fetching cliente with token ${token}`, error));
  }

}
