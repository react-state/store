import * as React from 'react';

import { Link, Route, Router } from 'react-router-dom';

import { AsyncDemo } from './async-demo';
import { Wrapper } from './wrapper';
import { StorageComponent } from './external-storage';
import { FormsComponent } from './forms.component';
import WrapperHooks from './hooks/wrapper-hooks';

export class Main extends React.Component<any, undefined> {

    render() {

        const links =
            <nav className='nav'>
                <li className='nav-item'>
                    <Link className='nav-link' to='/' title='Todos'>Todos</Link>
                </li>
                <li className='nav-item'>
                    <Link className='nav-link' to='/todos-hooks' title='Async Demo'>Todos Hooks</Link>
                </li>
                <li className='nav-item'>
                    <Link className='nav-link' to='/forms' title='Forms'>Forms</Link>
                </li>
                <li className='nav-item'>
                    <Link className='nav-link' to='/external-storage' title='External Storage'>External Storage</Link>
                </li>
                <li className='nav-item'>
                    <Link className='nav-link' to='/async-demo' title='Async Demo'>Async Demo</Link>
                </li>
            </nav>;

        return (
            <div>
                <div className='container'>
                    <Router history={this.props.history}>
                        <div>
                            {links}
                            <Route exact path='/' component={Wrapper} />
                            <Route path='/async-demo' component={AsyncDemo} />
                            <Route path='/forms' component={FormsComponent} />
                            <Route path='/external-storage' component={StorageComponent} />
                            <Route path='/todos-hooks' component={WrapperHooks} />
                        </div>
                    </Router>
                </div>
            </div>
        );
    }
}