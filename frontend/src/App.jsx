import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import routes from './routes';
import Layout from './layouts/Layout';
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import ProblemSet from './components/ProblemSet';
import AdminDashboard from './components/AdminDashboard';
import CreateProblem from './components/CreateProblem';
import UpdateProblem from './components/UpdateProblem';
import { PageNotFound } from './components/common';
import ProtectedRoute from './layouts/ProtectedRoute';
import ProblemContentInterface from './components/Problem';
import SubmissionsSet from './components/SubmissionsSet';
import Submission from './components/Submission';
import PlaylistSet from './components/PlaylistSet';
import Playlist from './components/Playlist';
import { useAuthStore } from './stores/useAuthStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={true} />
      <Routes>
        <Route path={routes.problems.problem} element={<ProblemContentInterface />} />
        <Route
          path={routes.login}
          element={isAuthenticated ? <Navigate to={routes.problems.all} /> : <Login />}
        />
        <Route
          path={routes.register}
          element={isAuthenticated ? <Navigate to={routes.problems.all} /> : <Register />}
        />

        <Route path={routes.root} element={<Layout />}>
          <Route index element={<Home />} />

          <Route path={routes.problems.all} element={<ProblemSet />} />

          <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
            <Route path={routes.profile} element={<Profile />} />

            <Route path={routes.submissions.all} element={<SubmissionsSet />} />
            <Route path={routes.submissions.submission} element={<Submission />} />

            <Route path={routes.playlists.all} element={<PlaylistSet />} />
            <Route path={routes.playlists.playlist} element={<Playlist />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path={routes.admin.dashboard} element={<AdminDashboard />} />
            <Route path={routes.admin.createProblem} element={<CreateProblem />} />
            <Route path={routes.admin.updateProblem} element={<UpdateProblem />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
