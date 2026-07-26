import type { BlogPost } from './types';

const STORAGE_KEY = 'yumeigu_blog_posts';

const defaultPosts: BlogPost[] = [
  {
    id: '1',
    title: '钰美固研磨设备全系列产品展示',
    summary:
      '从手推式研磨机到大型工业级设备，钰美固提供完整的地面处理解决方案。本文展示我们四大核心产品线的技术特点与应用场景。',
    coverImage: '/images/blog/machines.jpg',
    category: '产品动态',
    tags: ['研磨机', '产品线', '设备展示'],
    content: `## 钰美固研磨设备全系列产品展示

钰美固（YUMEIGU）专注于地面研磨与抛光设备的研发与制造，产品线覆盖从小型手推式到大型工业级全系列设备。

### 手推式研磨机

适合中小面积地面处理，操作灵活，便于运输。配备变频控制系统，可根据不同地面材质调节转速。

### 驾驶式研磨机

大面积施工的首选，效率高、操作舒适。配备大容量水箱和吸尘系统，实现无尘施工。

### 行星式研磨机

采用行星齿轮传动，磨盘自转+公转双重运动，研磨效率提升 40%。适合环氧地坪、水磨石、混凝土密封固化剂等多种地面处理。

### 工业级重型研磨机

针对大面积工业厂房、仓库、停车场等场景设计，功率大、效率高、耐用性强。

### 配套耗材

- **金刚石磨片**：用于混凝土、水磨石的粗磨和中磨
- **树脂磨片**：用于精细抛光，可达镜面效果
- **金属磨盘**：用于环氧地坪去除和地面找平
- **H315 聚氨酯涂料**：高耐磨耐候聚氨酯罩面，保护地面延长使用寿命`,
    author: '钰美固技术部',
    createdAt: '2025-01-15',
    viewCount: 328,
  },
  {
    id: '2',
    title: 'H315 高耐磨聚氨酯罩面涂料技术解析',
    summary:
      'H315 是钰美固自主研发的高耐磨耐候聚氨酯单面涂料，适用于各类工业地坪的表层保护。本文详解其配方特点、施工方法和性能优势。',
    coverImage: '/images/blog/coatings.jpg',
    category: '技术干货',
    tags: ['H315', '聚氨酯', '涂料', '地坪保护'],
    content: `## H315 高耐磨聚氨酯罩面涂料技术解析

### 产品概述

H315 是钰美固自主研发的双组分高耐磨耐候聚氨酯罩面涂料，由 A 组分（主剂）和 C 组分（固化剂）组成。

### 核心性能

| 指标 | 参数 |
|------|------|
| 耐磨性 | ≤ 0.02g（750g/500r） |
| 附着力 | 1 级（划格法） |
| 耐候性 | 人工加速老化 1000h 无粉化 |
| 硬度 | Shore D ≥ 75 |
| 固含量 | ≥ 95% |

### 适用范围

- 环氧地坪表层保护
- 混凝土密封固化剂地坪罩面
- 水磨石地坪保护
- 旧地坪翻新

### 施工方法

1. 地面打磨清洁，确保无尘无油
2. A 组分与 C 组分按比例混合搅拌均匀
3. 用滚筒或刮刀均匀涂布
4. 表干时间 4 小时，完全固化 7 天

### 包装规格

- 10kg 套装（A组分 7kg + C组分 3kg）
- 6kg 套装（A组分 4.2kg + C组分 1.8kg）
- 1kg 小样装`,
    author: '钰美固技术部',
    createdAt: '2025-01-10',
    viewCount: 256,
  },
  {
    id: '3',
    title: '金刚石磨片选型指南：从粗磨到精抛',
    summary:
      '不同目数的金刚石磨片适用于不同的研磨阶段。本文系统介绍钰美固全系列磨片产品的选型方法和使用技巧。',
    coverImage: '/images/blog/tools.jpg',
    category: '技术干货',
    tags: ['磨片', '金刚石', '选型', '研磨工艺'],
    content: `## 金刚石磨片选型指南

### 磨片分类

钰美固磨片产品涵盖地面研磨从粗磨到精抛的全流程：

**金属结合剂磨片（粗磨）**
- 16#、30#、60#：用于地面找平、环氧去除
- 特点：切削力强，寿命长

**树脂结合剂磨片（中磨）**
- 120#、200#、400#：用于地面整平、划痕去除
- 特点：研磨细腻，表面均匀

**软磨片（精抛）**
- 800#、1500#、3000#：用于地面抛光
- 特点：可达镜面效果

### 选型建议

| 地面类型 | 推荐工艺流程 |
|----------|-------------|
| 新浇混凝土 | 30#→60#→120#→200#→400#→800# |
| 旧环氧地坪 | 16#金属→30#→60#→120#→200# |
| 水磨石 | 60#→120#→200#→400#→800#→1500# |
| 大理石 | 200#→400#→800#→1500#→3000# |

### 使用技巧

1. 每道工序必须彻底清除上一道工序的划痕
2. 研磨时保持适当水量，避免干磨
3. 磨片磨损后及时更换，避免影响下一道工序
4. 不同品牌磨片不要混用`,
    author: '钰美固技术部',
    createdAt: '2025-01-05',
    viewCount: 189,
  },
];

function getPosts(): BlogPost[] {
  if (typeof window === 'undefined') return defaultPosts;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultPosts;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPosts));
  return defaultPosts;
}

function savePosts(posts: BlogPost[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export const blogStore = {
  getAll: (): BlogPost[] => getPosts(),

  getById: (id: string): BlogPost | undefined =>
    getPosts().find((p) => p.id === id),

  getByCategory: (category: string): BlogPost[] => {
    const posts = getPosts();
    if (category === '全部') return posts;
    return posts.filter((p) => p.category === category);
  },

  search: (keyword: string): BlogPost[] => {
    const kw = keyword.toLowerCase();
    return getPosts().filter(
      (p) =>
        p.title.toLowerCase().includes(kw) ||
        p.summary.toLowerCase().includes(kw) ||
        p.tags.some((t) => t.toLowerCase().includes(kw))
    );
  },

  incrementView: (id: string) => {
    const posts = getPosts();
    const post = posts.find((p) => p.id === id);
    if (post) {
      post.viewCount += 1;
      savePosts(posts);
    }
  },

  create: (post: Omit<BlogPost, 'id' | 'createdAt' | 'viewCount'>): BlogPost => {
    const posts = getPosts();
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      viewCount: 0,
    };
    posts.unshift(newPost);
    savePosts(posts);
    return newPost;
  },

  delete: (id: string) => {
    const posts = getPosts().filter((p) => p.id !== id);
    savePosts(posts);
  },
};
