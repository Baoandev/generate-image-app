import Home from '../pages/Home.js';
import Text2Image from '../pages/Text2Image.js';
import Sketch2Image from '../pages/Sketch2Image.js';
import ChangeStyle from '../pages/ChangeStyle.js';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/text2image', component: Text2Image },
    { path: '/Sketch2Image', component: Sketch2Image },
    { path: '/changeStyle', component: ChangeStyle },
]

export { publicRoutes };