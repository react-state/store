import * as React from "react";
import { HasStateActions } from "./decorators/component-state.decorator";

export class ReactComponentWithStateActions<P, S, TActions> extends React.Component<P, S> implements HasStateActions<TActions>  {
    actions: TActions = null;
    statePath: any = null;
}