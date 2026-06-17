import { buildMetrics, buildStages } from '../data/buildStages.js'
import { datasets, marketCategories } from '../data/datasets.js'

const DELAY_MS = 180

const delay = (ms = DELAY_MS) => new Promise((resolve) => {
  globalThis.setTimeout(resolve, ms)
})

const clone = (value) => structuredClone(value)

const normalizeText = (value) => String(value ?? '').trim().toLowerCase()

const datasetMatchesKeyword = (dataset, keyword) => {
  const normalizedKeyword = normalizeText(keyword)

  if (!normalizedKeyword) {
    return true
  }

  return [
    dataset.name,
    dataset.summary,
    dataset.category,
    dataset.taskType,
    dataset.modality,
    ...dataset.tags,
  ].some((value) => normalizeText(value).includes(normalizedKeyword))
}

const datasetMatchesCategory = (dataset, category) => {
  const normalizedCategory = normalizeText(category)

  if (!normalizedCategory || normalizedCategory === 'all') {
    return true
  }

  return normalizeText(dataset.groupId) === normalizedCategory
    || normalizeText(dataset.category) === normalizedCategory
    || dataset.tags.some((tag) => normalizeText(tag) === normalizedCategory)
}

const sortDatasets = (items, sort = 'latest') => {
  const sorted = [...items]

  if (sort === 'downloads') {
    return sorted.sort((first, second) => second.downloads - first.downloads)
  }

  if (sort === 'size') {
    return sorted.sort((first, second) => second.size - first.size)
  }

  return sorted.sort((first, second) => new Date(second.updatedAt) - new Date(first.updatedAt))
}

export const getBuildOverview = async () => {
  await delay()

  return clone({
    buildMetrics,
    buildStages,
  })
}

export const getMarketCategories = async () => {
  await delay()

  return clone(marketCategories)
}

export const getDatasets = async ({ keyword, category, sort } = {}) => {
  await delay()

  const filtered = datasets
    .filter((dataset) => datasetMatchesKeyword(dataset, keyword))
    .filter((dataset) => datasetMatchesCategory(dataset, category))

  return clone(sortDatasets(filtered, sort))
}

export const getDatasetDetail = async (id) => {
  await delay()

  const dataset = datasets.find((item) => item.id === id)

  return dataset ? clone(dataset) : null
}

export const getRelatedDatasets = async (id) => {
  await delay()

  const dataset = datasets.find((item) => item.id === id)

  if (!dataset) {
    return []
  }

  return clone(datasets.filter((item) => dataset.relatedIds.includes(item.id)))
}

export const toggleFavorite = async (id) => {
  await delay()

  const dataset = datasets.find((item) => item.id === id)

  if (!dataset) {
    return null
  }

  dataset.isFavorite = !dataset.isFavorite

  return clone(dataset)
}

export const simulateDownload = async (id) => {
  await delay()

  const dataset = datasets.find((item) => item.id === id)

  if (!dataset) {
    return {
      id,
      status: 'not-found',
      message: '数据集不存在',
    }
  }

  return {
    id,
    status: 'success',
    message: '下载任务已创建',
  }
}

export const getDatasetsByCategory = async (category) => {
  await delay()
  
  const categoryMap = {
    herb: (dataset) => 
      dataset.tags.some(tag => ['药材图像', '本草'].includes(tag)) ||
      (dataset.category === '医学影像' && dataset.domain.includes('药材')),
    
    classic: (dataset) =>
      dataset.tags.some(tag => ['经典名方', '方剂'].includes(tag)) ||
      dataset.domain.includes('方剂学'),
    
    clinical: (dataset) =>
      dataset.category === '临床数据' ||
      dataset.tags.some(tag => ['病案', '随访'].includes(tag))
  }
  
  const filterFn = categoryMap[category]
  if (!filterFn) return []
  
  return clone(datasets.filter(filterFn))
}
