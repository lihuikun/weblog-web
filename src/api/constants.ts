/**
 * 面试题分类选项
 */
export const categoryOptions = [
  { value: 1, label: 'JavaScript' },
  { value: 2, label: 'Vue' },
  { value: 3, label: 'React' },
  { value: 4, label: 'Node.js' },
  { value: 5, label: '算法' },
  { value: 6, label: '网络' },
  { value: 7, label: '浏览器' }
]

/**
 * 面试题难度选项
 */
export const difficultyOptions = [
  { value: 1, label: '简单' },
  { value: 2, label: '中等' },
  { value: 3, label: '困难' },
  { value: 4, label: '专家' }
]

/**
 * 面试题难度对应的颜色和文字
 */
export const difficultyMap = {
  1: { color: 'green', text: '简单' },
  2: { color: 'blue', text: '中等' },
  3: { color: 'orange', text: '困难' },
  4: { color: 'red', text: '专家' }
}

/**
 * 会员选项
 */
export const premiumOptions = [
  { value: true, label: '会员专属' },
  { value: false, label: '所有用户' }
] 