import { useRouteMatch } from 'react-router';

export const useBreadCrumbs = (): string => {
  const { path } = useRouteMatch();
  const trimmedPath = path.slice(1);

  const mapping: { [key: string]: string } = {
    thermometers: 'Termometry',
    settings: 'Ustawienia',
    security: 'Bezpieczeństwo',
  };

  const name = mapping[trimmedPath];

  return name ? '\\ ' + name : '';
};
