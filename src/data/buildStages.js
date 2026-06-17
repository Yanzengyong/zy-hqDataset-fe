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
    title: '数据源接入',
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
    configTitle: '数据源配置项',
    configGroups: [
      {
        label: '接入范围',
        items: ['古籍文献库', '临床病历库', '方剂本草库', '药材/舌象图像库'],
      },
      {
        label: '接入评估',
        items: [
          { label: '来源评级', value: 'S' },
          { label: '授权状态', value: '已授权' },
          { label: '批次编号', value: 'TCM-SRC-20260617-01' },
          { label: '敏感字段预检', value: '通过' },
        ],
      },
    ],
  },
  {
    id: 'collect',
    title: '数据采集',
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
    configTitle: '采集配置项',
    configGroups: [
      {
        label: '采集方式',
        items: ['OCR 批量识别', '接口同步', '文件批量导入', '图像采集登记'],
      },
      {
        label: '清洗规则',
        items: ['重复样本合并', '字段映射', '术语规范化', '异常记录回流'],
      },
      {
        label: '输出结果',
        items: ['结构化数据表', '采集日志', '清洗报告', '异常样本队列'],
      },
    ],
  },
  {
    id: 'annotate',
    title: '数据标注',
    subtitle: 'Expert Annotation',
    description: '围绕中医核心实体与疗效关系开展人机协同标注，并通过多轮一致性检查形成高置信样本。',
    sourceTypes: ['疾病', '证候', '方剂', '中药', '功效', '主治', '疗效关系'],
    capabilities: ['实体标注', '关系抽取', '证候归一', '专家复审'],
    metrics: [
      { label: '标注标签', value: '186类' },
      { label: '专家复核', value: '3轮' },
      { label: '一致性 Kappa', value: '0.87' },
    ],
    accent: '#9a6b16',
    configTitle: '标注配置项',
    configGroups: [
      {
        label: '标注体系',
        items: ['疾病实体', '证候实体', '方剂/中药实体', '功效与主治关系'],
      },
      {
        label: '协同规则',
        items: ['机器预标注', '双人交叉标注', '专家复审', '冲突样本仲裁'],
      },
      {
        label: '输出结果',
        items: ['标注样本集', '标签字典', '关系三元组', '标注一致性报告'],
      },
    ],
  },
  {
    id: 'quality',
    title: '数据质量评估',
    subtitle: 'Quality Assessment',
    description: '对数据完整性、准确性、一致性、可追溯性和中医药术语规范性进行多维质量评估。',
    sourceTypes: ['完整性', '准确性', '一致性', '可追溯性', '术语规范性'],
    capabilities: ['规则校验', '抽样复核', '一致性计算', '质量分级', '问题回流'],
    metrics: [
      { label: '质检规则', value: '72项' },
      { label: '综合评分', value: '96.2' },
      { label: '问题闭环', value: '98%' },
    ],
    accent: '#7f4dff',
    configTitle: '质量评估配置项',
    configGroups: [
      {
        label: '评估维度',
        items: ['字段完整性', '标签准确性', '标注一致性', '来源可追溯性'],
      },
      {
        label: '质检策略',
        items: ['规则自动校验', '专家抽样复核', '低分样本回流', '质量分级发布'],
      },
      {
        label: '输出结果',
        items: ['质量评分', '问题样本清单', '质检报告', '修订建议'],
      },
    ],
  },
  {
    id: 'product',
    title: '数据集产品',
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
    configTitle: '数据集产品预览',
    configGroups: [
      {
        label: '产品形态',
        items: ['训练数据集', '评测基准集', '知识图谱资产', '多模态样例包'],
      },
      {
        label: '交付内容',
        items: ['元数据说明', '字段字典', '样例预览', '质量报告', '授权说明'],
      },
      {
        label: '预览信息',
        items: ['数据规模：18.6 GB', '综合质检分：96.2', '可下载文件：5个', '版本：V2026.06'],
      },
    ],
  },
]
