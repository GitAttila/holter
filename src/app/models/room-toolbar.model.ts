export interface IRoomToolbarItem {
  type: 'slide-toggle' | 'button';
  label: string;
  name: string;
  color: 'primary' | 'accent';
  disabled: boolean;
  value?: boolean | string;
}
