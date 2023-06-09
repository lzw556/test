import { Asset, AssetCategory, AssetRow, ASSET_CATEGORY } from '../..';
import { ROOT_ASSETS } from '../../../../config/assetCategory.config';

export function convertRow(values?: AssetRow): Asset | null {
  if (!values) return null;
  return {
    id: values.id,
    name: values.name,
    parent_id: values.parentId,
    type: values.type,
    attributes: values.attributes
  };
}

export function getGenerals(assets: AssetRow[]) {
  return assets.filter((a) => a.type === ROOT_ASSETS.get('general'));
}

export function getValidParents(assets: AssetRow[], assetId: number) {
  return getGenerals(assets).filter((a) => a.id !== assetId && a.parentId !== assetId);
}

export function sortAssetsByIndex(assets: AssetRow[]) {
  const res = [...assets];
  return res.sort(
    (prev, crt) =>
      (prev.attributes?.index ?? Number.MAX_VALUE) - (crt.attributes?.index ?? Number.MAX_VALUE)
  );
}
