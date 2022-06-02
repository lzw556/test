package command

import (
	"context"

	"github.com/thetasensors/theta-cloud-lite/server/adapter/api/request"
	"github.com/thetasensors/theta-cloud-lite/server/adapter/repository"
	"github.com/thetasensors/theta-cloud-lite/server/adapter/ruleengine"
	"github.com/thetasensors/theta-cloud-lite/server/domain/dependency"
	"github.com/thetasensors/theta-cloud-lite/server/domain/entity"
	spec "github.com/thetasensors/theta-cloud-lite/server/domain/specification"
	"github.com/thetasensors/theta-cloud-lite/server/pkg/transaction"
)

type AlarmRuleGroupUpdateCmd struct {
	entity.AlarmRuleGroup

	alarmRuleGroupRepo       dependency.AlarmRuleGroupRepository
	alarmRuleGroupSourceRepo dependency.AlarmRuleGroupSourceRepository
	alarmRuleRepo            dependency.AlarmRuleRepository
}

func NewAlarmRuleGroupUpdateCmd() AlarmRuleGroupUpdateCmd {
	return AlarmRuleGroupUpdateCmd{
		alarmRuleGroupRepo:       repository.AlarmRuleGroup{},
		alarmRuleGroupSourceRepo: repository.AlarmRuleGroupSource{},
		alarmRuleRepo:            repository.AlarmRule{},
	}
}

func (cmd AlarmRuleGroupUpdateCmd) Update(req request.UpdateAlarmRuleGroup) error {
	return transaction.Execute(context.TODO(), func(txCtx context.Context) error {
		cmd.AlarmRuleGroup.Name = req.Name
		cmd.AlarmRuleGroup.Description = req.Description
		cmd.AlarmRuleGroup.Type = req.Type

		if err := cmd.alarmRuleGroupRepo.Save(txCtx, &cmd.AlarmRuleGroup); err != nil {
			return err
		}

		bindings, err := cmd.alarmRuleGroupSourceRepo.FindBySpecs(txCtx, spec.GroupIDEqSpec(cmd.AlarmRuleGroup.ID))
		if err != nil {
			return err
		}

		for _, binding := range bindings {
			e, err := cmd.alarmRuleRepo.Get(txCtx, binding.AlarmRuleID)
			if err != nil {
				return err
			}

			for _, newRule := range req.Rules {
				if newRule.ID == binding.AlarmRuleID {
					e.Description = newRule.Description
					e.Operation = newRule.Operation
					e.Level = newRule.Level
					e.Threshold = newRule.Threshold
					e.Duration = newRule.Duration

					if err := cmd.alarmRuleRepo.Save(txCtx, &e); err != nil {
						return err
					}

					if err := ruleengine.UpdateRules(e); err != nil {
						return err
					}
				}
			}
		}

		return nil
	})
}