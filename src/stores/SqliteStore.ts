import { DB } from "https://deno.land/x/sqlite@v2.4.0/mod.ts";

export default class SqliteStore {
  private db: any
  private path: string
  private tableName: string

  constructor(options: any) {
    this.db = new DB(options.path)
    this.path = options.path
    this.tableName = options.tableName || 'sessions'
    this.db.query(`CREATE TABLE IF NOT EXISTS ${this.tableName} (id TEXT, data TEXT)`)
  }

  sessionExists(sessionId: string) {
    let session = ''
    
    for (const [sess] of this.db.query(`SELECT data FROM ${this.tableName} WHERE id = ?`, [sessionId])) {
      session = sess
    }

    return session ? true : false;
  }

  getSessionById(sessionId: string) {
    let session = ''
    
    for (const [sess] of this.db.query(`SELECT data FROM ${this.tableName} WHERE id = ?`, [sessionId])) {
      session = sess
    }

    return JSON.parse(session);
  }

  createSession(sessionId: string) {
    this.db.query(`INSERT INTO ${this.tableName} (id, data) VALUES (?, ?)`, [sessionId, JSON.stringify({})]);
  }

  getSessionVariable(sessionId: string, variableKey: string) {
    const session = this.getSessionById(sessionId)
    return session[variableKey]
  }

  setSessionVariable(sessionId: string, variableKey: string, variableValue: string) {
    const session = this.getSessionById(sessionId);
		session[variableKey] = variableValue
		
		this.db.query(`UPDATE ${this.tableName} SET data = ? WHERE id = ?`, [
      JSON.stringify(session), sessionId
    ]);
  }
}