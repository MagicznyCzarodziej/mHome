import { MHome } from 'app/app';
import Container from 'typedi';

const mHome = Container.get(MHome);
mHome.init();
