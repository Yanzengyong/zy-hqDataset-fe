export const buildMetrics = [
  {
    label: '汇聚数据源',
    value: '128',
    unit: '类',
    description: '覆盖古籍、临床、科研、图像与知识资产',
  },
  {
    label: '术语标准化率',
    value: '96.8%',
    unit: '',
    description: '对齐中医病证、方剂、本草与功效术语',
  },
  {
    label: '质量分级与专家质检',
    value: '3级 / 5层',
    unit: '',
    description: '机器校验、交叉复核、专家终审全流程留痕',
  },
  {
    label: '数据集产品',
    value: '42',
    unit: '个',
    description: '面向训练、评测、检索与知识图谱应用',
  },
]

export const buildStages = [
  {
    id: 'source',
    title: '多源中医药数据接入',
    subtitle: 'Source Registry',
    description: '统一登记中医药原始数据来源，建立来源可信度、授权状态、采集批次与可追溯标识。',
    sourceTypes: ['古籍文献', '临床病历', '方剂本草', '科研语料', '药材图像', '舌象图像'],
    capabilities: ['来源确权', '批次追踪', '授权校验', '数据脱敏预检'],
    metrics: [
      { label: '来源类型', value: '6类' },
      { label: '登记来源', value: '128项' },
      { label: '授权覆盖', value: '92%' },
    ],
    accent: '#1f8a70',
  },
  {
    id: 'collect',
    title: '采集清洗与结构化入库',
    subtitle: 'Collection Pipeline',
    description: '将非结构化文本、接口数据、批量文件与图像资料转换为可治理、可检索、可复用的标准数据单元。',
    sourceTypes: ['OCR 识别', '接口同步', '批量导入', '术语抽取', '结构化入库'],
    capabilities: ['版面解析', '字段映射', '去重合并', '术语规范化', '异常记录回流'],
    metrics: [
      { label: '日处理能力', value: '18万条' },
      { label: '结构化率', value: '94.5%' },
      { label: '术语命中', value: '326万次' },
    ],
    accent: '#2f6fbb',
  },
  {
    id: 'annotate',
    title: '专业标注与质量评审',
    subtitle: 'Expert Annotation',
    description: '围绕中医核心实体与疗效关系开展人机协同标注，并通过多轮一致性检查形成高置信样本。',
    sourceTypes: ['疾病', '证候', '方剂', '中药', '功效', '主治', '疗效关系'],
    capabilities: ['实体标注', '关系抽取', '证候归一', '专家复审', '一致性评估'],
    metrics: [
      { label: '标注标签', value: '186类' },
      { label: '专家复核', value: '5层' },
      { label: '一致性 Kappa', value: '0.87' },
    ],
    accent: '#9a6b16',
  },
  {
    id: 'product',
    title: '数据集产品化交付',
    subtitle: 'Dataset Products',
    description: '按照训练、评测、知识检索、影像识别等场景封装数据集，提供元数据、样例、质检报告与授权说明。',
    sourceTypes: ['专病数据集', '方剂知识集', '中医药评测集', '舌象图像数据集', '知识图谱资产'],
    capabilities: ['版本发布', '样例预览', '质量报告', '授权管理', '下载任务编排'],
    metrics: [
      { label: '发布产品', value: '42个' },
      { label: '平均质检分', value: '96.2' },
      { label: '复用项目', value: '318项' },
    ],
    accent: '#8f4a63',
  },
]
