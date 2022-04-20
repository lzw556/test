package command

import (
	"context"
	"github.com/thetasensors/theta-cloud-lite/server/adapter/repository"
	"github.com/thetasensors/theta-cloud-lite/server/domain/dependency"
	"github.com/thetasensors/theta-cloud-lite/server/domain/entity"
	"github.com/thetasensors/theta-cloud-lite/server/pkg/transaction"
)

type AlarmRecordRemoveCmd struct {
	entity.AlarmRecord

	deviceRepo           dependency.DeviceRepository
	alarmRecordRepo      dependency.AlarmRecordRepository
	deviceAlertStateRepo dependency.DeviceAlertStateRepository
}

func NewAlarmRecordRemoveCmd() AlarmRecordRemoveCmd {
	return AlarmRecordRemoveCmd{
		deviceRepo:           repository.Device{},
		alarmRecordRepo:      repository.AlarmRecord{},
		deviceAlertStateRepo: repository.DeviceAlertState{},
	}
}

func (cmd AlarmRecordRemoveCmd) Run() error {
	return transaction.Execute(context.TODO(), func(txCtx context.Context) error {
		if err := cmd.alarmRecordRepo.Delete(txCtx, cmd.AlarmRecord.ID); err != nil {
			return err
		}
		if cmd.AlarmRecord.Category == entity.AlarmRuleCategoryDevice {
			if device, err := cmd.deviceRepo.Get(txCtx, cmd.AlarmRecord.SourceID); err == nil {
				if state, err := cmd.deviceAlertStateRepo.Get(device.MacAddress, cmd.AlarmRecord.AlarmRuleID); err == nil {
					if state.Record.ID == cmd.AlarmRecord.ID {
						return cmd.deviceAlertStateRepo.Delete(device.MacAddress, cmd.AlarmRecord.AlarmRuleID)
					}
				}
			}
		}
		return nil
	})
}