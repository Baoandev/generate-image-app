import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';

import './App.css';
import { publicRoutes } from './routes/index.js';
import DefaultLayout from './layouts/DefaultLayout.js';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {publicRoutes.map((value, index) => (
                    <Route key={index} path={value.path} element={
                        <DefaultLayout>
                            <value.component />
                        </DefaultLayout>
                    } />
                ))}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
