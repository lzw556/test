import * as React from 'react';
import { AssetRow } from '../assetList/props';
import { MeasurementRow } from '../summary/measurement/props';

export type EditFormPayload = { asset?: AssetRow; measurement?: MeasurementRow };

export function useActionBarStatus() {
  const [visible, setVisible] = React.useState(false);
  const [target, setTarget] = React.useState<number | undefined>();
  const [payload, setPayload] = React.useState<EditFormPayload>();

  const handleTopAssetEdit = (data?: EditFormPayload) => {
    setPayload(data);
    setVisible(true);
    setTarget(0);
  };

  const handleWindEdit = (data?: EditFormPayload) => {
    setPayload(data);
    setVisible(true);
    setTarget(1);
  };

  const handleFlangeEdit = (data?: EditFormPayload) => {
    setPayload(data);
    setVisible(true);
    setTarget(2);
  };

  const handleMeasurementEdit = (data?: EditFormPayload) => {
    setPayload(data);
    setVisible(true);
    setTarget(3);
  };

  const handleChildAddition = (data?: EditFormPayload) => {
    setPayload(data);
    setVisible(true);
    setTarget(4);
  };

  const handleAddMeasurements = (data?: EditFormPayload) => {
    setPayload(data);
    setVisible(true);
    setTarget(5);
  };

  return {
    visible,
    setVisible,
    target,
    payload,
    handleTopAssetEdit,
    handleWindEdit,
    handleFlangeEdit,
    handleMeasurementEdit,
    handleChildAddition,
    handleAddMeasurements
  };
}
