import 'react-redux';
import { RootState } from 'store/configureStore';
declare module 'react-redux' {
  interface DefaultRootState extends RootState {}
}
