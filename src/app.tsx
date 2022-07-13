import AuthProvider from './context/auth';
import { AppRouter } from './routes';

export const App = () => {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
};