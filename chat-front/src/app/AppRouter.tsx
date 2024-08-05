
import {Navigate, Route, Routes} from 'react-router-dom';
import { privateRoutes, publicRoutes } from './router';
// import { useAppSelector } from '../shared/hooks/redux';

const AppRouter = () => {
    const auth = localStorage.getItem('auth')
    return (
        auth
            ?
            <Routes>
                {privateRoutes.map((route) => (
                    <Route path={route.path}
                           element={<route.component/>}
                           key={route.path} />))}
                <Route path="*"
                       element={<Navigate to='/chat' replace/>}/>
            </Routes>
            :
            <Routes>
                {publicRoutes.map((route) => (
                    <Route path={route.path}
                           element={<route.component/>}
                           key={route.path} />))}
                    <Route path="*"
                       element={<Navigate to='/login' replace/>}/>
                       
            </Routes>
    );
};

export default AppRouter;