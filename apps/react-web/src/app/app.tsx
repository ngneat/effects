import { Link, Route } from 'react-router-dom';
import { TodosPage } from './todos-page/todos-page';

export function App() {
  return (
    <>
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/todos">Todos</Link>
          </li>
        </ul>
      </div>
      <Route
        path="/"
        exact
        render={() => (
          <div>
            This is the generated root route.{' '}
            <Link to="/todos">Click here for todos.</Link>
          </div>
        )}
      />
      <Route path="/todos" exact component={TodosPage} />
    </>
  );
}

export default App;
