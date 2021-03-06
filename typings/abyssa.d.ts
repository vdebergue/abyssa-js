
interface RouterAPI {
  transitionTo(stateName: string, params?: Object, acc?: any): void;
  transitionTo(pathQuery: string, acc?: any): void;
  backTo(stateName: string, defaultParams?: Object, acc?: any);
  link(stateName: string, params?: Object): string;
  previous(): StateWithParams;
  current(): StateWithParams;
  findState(optionsOrFullName: any): State;
  isFirstTransition(): boolean;
  paramsDiff(): Object;

  transition: { on: (eventName: 'started' | 'ended',
    handler: (currentState: State, previousState: State) => void) => void };
}

interface Router {
  configure(options: ConfigOptions): this;
  addState(name: string, state: State): this;
  init(initState?: string, initParams?: Object): RouterAPI;
}

interface StateWithParams {
  uri: string;
  params: Params;
  name: string;
  fullName: string;

  isIn(fullName: string): boolean;

  data(key: string): any;
  data(key: string, value: any): void;
}

interface StateMap {
  [stateName: string]: State;
}

interface State {
  uri: string
}

interface ConfigOptions {
  enableLogs?: boolean,
  interceptAnchors?: boolean,
  notFound?: string,
  urlSync?: 'history' | 'hash',
  hashPrefix?: string
}

interface Params {
  [key: string]: string;
}

type LifeCycleCallback = (params: Params, value: any, router: RouterAPI) => void;

type StateOptions = {
  uri: string,
  children?: StateMap,
  enter?: LifeCycleCallback,
  exit?: LifeCycleCallback,
  update?: LifeCycleCallback
};


export function Router(states: StateMap): Router;
export function State(uri: string, options: StateOptions): State;
export var api: RouterAPI;
