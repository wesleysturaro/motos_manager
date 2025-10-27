export interface InventorySummaryResponse {
  byStatus: Array<{ status: string; total: number }>;
  byBrand: Array<{ brandId?: string; brandid?: string; brandname?: string; brandName?: string; total: number }>;
  byModel: Array<{ modelId?: string; modelid?: string; modelname?: string; modelName?: string; total: number }>;
}
