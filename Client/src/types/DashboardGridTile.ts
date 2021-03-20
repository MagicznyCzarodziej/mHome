export interface DashboardGridTile {
  id: string;
  label: string;
  icon: any;
  lock?: 'LOCKED' | 'UNLOCKED';
}
