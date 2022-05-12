import { Link, Route, Routes } from 'react-router-dom';
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
      <Routes>

        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/todos">Click here for todos.</Link>
            </div>
          }
        />
        <Route path="/todos" element={<TodosPage />} />
      </Routes>

    </>
  );
}

export default App;
