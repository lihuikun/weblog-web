export interface RoleItem {
  value: string;
  label: string;
  isAdvanced: boolean;
}

export const roleList: RoleItem[] = [
  {
    value: 'admin',
    label: '超级管理员',
    isAdvanced: true
  },
  {
    value: 'subAdmin',
    label: '子管理员',
    isAdvanced: true
  },
  {
    value: 'user',
    label: '用户',
    isAdvanced: false
  }
] 