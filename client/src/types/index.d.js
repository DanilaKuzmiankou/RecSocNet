export type State = { [k: string]: any }
export type InitialSetters = {
    [k: string]: (s: State, ...args: any[]) => void | Partial<State>
}
export type Store = { state: State; setters: InitialSetters }
export type Children = { children: React.ReactNode }
