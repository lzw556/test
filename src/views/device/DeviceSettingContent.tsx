import { Divider } from 'antd';
import * as React from 'react';
import DeviceSettingFormItem from '../../components/formItems/deviceSettingFormItem';
import { SETTING_GROUPS } from '../../constants/settingGroup';
import { DeviceSetting } from '../../types/device_setting';
import { DeviceType } from '../../types/device_type';
import { EmptyLayout } from '../layout';

export const DeviceSettingContent: React.FC<{
  deviceType: DeviceType;
  settings?: DeviceSetting[];
}> = ({ deviceType, settings }) => {
  if (deviceType !== DeviceType.Router && settings) {
    if (
      deviceType === DeviceType.BoltElongation ||
      deviceType === DeviceType.BoltElongationMultiChannels
    ) {
      let groups: DeviceSetting['group'][] = [];
      settings.forEach((setting) => {
        if (
          setting.group &&
          (groups.length === 0 || !groups.find((group) => group === setting.group))
        ) {
          groups.push(setting.group);
        }
      });
      if (groups.length > 0) {
        return (
          <>
            {groups.map((group) => {
              return (
                <fieldset>
                  <legend>{(group && SETTING_GROUPS[group]) || group}</legend>
                  {settings
                    .filter((setting) => setting.group === group)
                    .map((setting) => (
                      <DeviceSettingFormItem editable={true} value={setting} key={setting.key} />
                    ))}
                </fieldset>
              );
            })}
          </>
        );
      }
    } else {
      return (
        <>
          {settings.map((setting) => (
            <DeviceSettingFormItem editable={true} value={setting} key={setting.key} />
          ))}
        </>
      );
    }
  }
  return null;
};
