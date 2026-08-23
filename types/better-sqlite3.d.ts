declare module 'better-sqlite3' {
  interface RunResult {
    changes: number;
    lastInsertRowid: number | bigint;
  }

  interface Statement<BindParameters extends any[] = any[]> {
    bind(...params: BindParameters): this;
    run(...params: BindParameters): RunResult;
    get(...params: BindParameters): any;
    all(...params: BindParameters): any[];
    iterate(...params: BindParameters): IterableIterator<any>;
    pluck(toggleState?: boolean): this;
    expand(toggleState?: boolean): this;
    raw(toggleState?: boolean): this;
    columns(): Array<{ name: string; column: string | null; table: string | null; database: string | null; type: string | null }>;
  }

  interface Database {
    prepare(source: string): Statement;
    transaction<F extends (...args: any[]) => any>(fn: F): F;
    exec(source: string): this;
    pragma(source: string, options?: { simple?: boolean }): any;
    close(): this;
  }

  interface DatabaseConstructor {
    new (filename?: string, options?: any): Database;
    (filename?: string, options?: any): Database;
  }

  const Database: DatabaseConstructor;
  export default Database;
}
