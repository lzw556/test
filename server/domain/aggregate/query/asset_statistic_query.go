package query

import (
	"context"
	"github.com/thetasensors/theta-cloud-lite/server/adapter/repository"
	"github.com/thetasensors/theta-cloud-lite/server/domain/dependency"
	"github.com/thetasensors/theta-cloud-lite/server/domain/entity"
	"github.com/thetasensors/theta-cloud-lite/server/domain/po"
	"github.com/thetasensors/theta-cloud-lite/server/domain/vo"
)

type AssetStatisticQuery struct {
	po.Asset
	Devices entity.Devices

	propertyRepo         dependency.PropertyRepository
	deviceStatusRepo     dependency.DeviceStatusRepository
	deviceAlertStateRepo dependency.DeviceAlertStateRepository
	deviceDataRepo       dependency.DeviceDataRepository
}

func NewAssetStatisticQuery() AssetStatisticQuery {
	return AssetStatisticQuery{
		propertyRepo:         repository.Property{},
		deviceDataRepo:       repository.DeviceData{},
		deviceStatusRepo:     repository.DeviceStatus{},
		deviceAlertStateRepo: repository.DeviceAlertState{},
	}
}

func (query AssetStatisticQuery) Statistic() (*vo.AssetStatistic, error) {
	var err error
	result := vo.NewAssetStatistic(query.Asset)
	result.Devices, err = query.buildDevices(query.Devices)
	result.UpdateStatus()
	return &result, err
}

func (query AssetStatisticQuery) buildDevices(devices []entity.Device) ([]vo.Device, error) {
	result := make([]vo.Device, len(devices))
	propertyMap := map[uint][]po.Property{}
	for i, device := range devices {
		result[i] = vo.NewDevice(device)
		if _, ok := propertyMap[device.TypeID]; !ok {
			propertyMap[device.TypeID], _ = query.propertyRepo.FindByDeviceTypeID(context.TODO(), device.TypeID)
		}
		if status, err := query.deviceStatusRepo.Get(device.ID); err == nil {
			result[i].State.DeviceStatus = status
		}
		if alert, err := query.deviceAlertStateRepo.Get(device.ID); err == nil {
			result[i].AlertState = vo.NewDeviceAlertState(alert)
		}
		result[i].SetProperties(propertyMap[device.TypeID])
		query.setLastPropertiesData(&result[i])
	}
	return result, nil
}

func (query AssetStatisticQuery) setLastPropertiesData(device *vo.Device) {
	data, err := query.deviceDataRepo.Last(device.ID)
	if err != nil {
		return
	}
	for i, property := range device.Properties {
		device.Properties[i].Data = vo.PropertyData{
			Name:   property.Name,
			Unit:   property.Unit,
			Fields: map[string][]float32{},
		}
		device.Properties[i].Data.Time = []int64{data.Time.UTC().Unix()}
		for _, field := range property.Fields {
			if len(data.Values) > 0 {
				device.Properties[i].Data.Fields[field.Name] = append(device.Properties[i].Data.Fields[field.Name], data.Values[field.Index])
			}
		}
	}
	return
}
