package query

import (
	"context"
	"encoding/json"
	"time"

	"github.com/spf13/cast"
	"github.com/thetasensors/theta-cloud-lite/server/adapter/api/request"
	"github.com/thetasensors/theta-cloud-lite/server/adapter/api/response"
	"github.com/thetasensors/theta-cloud-lite/server/adapter/repository"
	"github.com/thetasensors/theta-cloud-lite/server/domain/dependency"
	"github.com/thetasensors/theta-cloud-lite/server/domain/entity"
	"github.com/thetasensors/theta-cloud-lite/server/domain/openapivo"
	spec "github.com/thetasensors/theta-cloud-lite/server/domain/specification"
	"github.com/thetasensors/theta-cloud-lite/server/pkg/cache"
	"github.com/thetasensors/theta-cloud-lite/server/pkg/devicetype"
)

type OpenApiQuery struct {
	entity.Project

	deviceRepo            dependency.DeviceRepository
	deviceInformationRepo dependency.DeviceInformationRepository
	deviceStateRepo       dependency.DeviceStateRepository
	sensorDataRepo        dependency.SensorDataRepository
	networkRepo           dependency.NetworkRepository
}

func NewOpenApiQuery() OpenApiQuery {
	return OpenApiQuery{
		deviceRepo:            repository.Device{},
		deviceInformationRepo: repository.DeviceInformation{},
		deviceStateRepo:       repository.DeviceState{},
		sensorDataRepo:        repository.SensorData{},
		networkRepo:           repository.Network{},
	}
}

func (query OpenApiQuery) FindDevices() []openapivo.Device {
	ctx := context.Background()
	devices, err := query.deviceRepo.FindBySpecs(ctx, spec.ProjectEqSpec(query.Project.ID))
	if err != nil {
		return []openapivo.Device{}
	}
	networks := make(map[uint]entity.Network)
	result := make([]openapivo.Device, len(devices))
	for i, device := range devices {
		r := openapivo.NewDevice(device)
		r.IsOnline, r.ConnectedAt, _ = cache.GetConnection(device.MacAddress)
		if information, err := query.deviceInformationRepo.Get(device.MacAddress); err == nil {
			r.Information = openapivo.DeviceInformation{
				Model:           information.Model,
				FirmwareID:      information.ProductID,
				FirmwareVersion: information.FirmwareVersion,
				IPAddress:       information.IPAddress,
				Gateway:         information.Gateway,
				SubnetMask:      information.SubnetMask,
				IccID4G:         information.IccID4G,
			}
		}
		if state, err := query.deviceStateRepo.Get(device.MacAddress); err == nil {
			r.BatteryVoltage = state.BatteryVoltage
			r.SignalLevel = state.SignalLevel
		}
		if _, ok := networks[device.NetworkID]; !ok {
			if network, err := query.networkRepo.Get(ctx, device.NetworkID); err == nil {
				networks[network.ID] = network
			}
		}
		if network, ok := networks[device.NetworkID]; ok {
			r.Network = network.Name
		}
		result[i] = r
	}
	return result
}

func (query OpenApiQuery) GetDevice(mac string) (*openapivo.Device, error) {
	ctx := context.Background()
	device, err := query.deviceRepo.GetBySpecs(ctx, spec.ProjectEqSpec(query.Project.ID), spec.DeviceMacEqSpec(mac))
	if err != nil {
		return nil, response.ErrOpenApiDeviceNotFound()
	}
	result := openapivo.NewDevice(device)
	result.IsOnline, result.ConnectedAt, _ = cache.GetConnection(device.MacAddress)
	if information, err := query.deviceInformationRepo.Get(device.MacAddress); err == nil {
		result.Information = openapivo.DeviceInformation{
			Model:           information.Model,
			FirmwareID:      information.ProductID,
			FirmwareVersion: information.FirmwareVersion,
			IPAddress:       information.IPAddress,
			Gateway:         information.Gateway,
			SubnetMask:      information.SubnetMask,
			IccID4G:         information.IccID4G,
		}
	}
	if state, err := query.deviceStateRepo.Get(device.MacAddress); err == nil {
		result.BatteryVoltage = state.BatteryVoltage
		result.SignalLevel = state.SignalLevel
	}
	if network, err := query.networkRepo.Get(ctx, device.NetworkID); err == nil {
		result.Network = network.Name
	}
	return &result, nil
}

func (query OpenApiQuery) FindDeviceData(mac, property string, from, to int64) ([]openapivo.DeviceData, error) {
	ctx := context.Background()
	device, err := query.deviceRepo.GetBySpecs(ctx, spec.DeviceMacEqSpec(mac), spec.ProjectEqSpec(query.Project.ID))
	if err != nil {
		return nil, response.ErrOpenApiDeviceNotFound()
	}
	result := make([]openapivo.DeviceData, 0)
	if t := devicetype.Get(device.Type); t != nil {
		data, err := query.sensorDataRepo.Find(device.MacAddress, t.SensorID(), time.Unix(from, 0), time.Unix(to, 0))
		if err != nil {
			return nil, err
		}
		for _, d := range data {
			r := openapivo.DeviceData{
				Timestamp: d.Time.Unix(),
				Values:    map[string]interface{}{},
			}
			for _, prop := range t.Properties(t.SensorID()) {
				for _, field := range prop.Fields {
					if len(property) > 0 {
						if property == field.Key {
							r.Values[field.Key] = d.Values[field.Key]
						}
					} else {
						r.Values[field.Key] = d.Values[field.Key]
					}
				}
			}
			result = append(result, r)
		}
	}
	return result, nil
}

func (query OpenApiQuery) FindAssets() ([]openapivo.Asset, error) {
	assetQuery := NewAssetQuery()
	assetQuery.Specs = []spec.Specification{spec.ProjectEqSpec(query.Project.ID)}

	assets, err := assetQuery.List()
	if err != nil {
		return nil, err
	}

	var result []openapivo.Asset
	str, _ := json.Marshal(assets)
	json.Unmarshal(str, &result)

	return result, nil
}

func (query OpenApiQuery) GetAsset(mpID uint) (*openapivo.Asset, error) {
	assetQuery := NewAssetQuery()
	assetQuery.Specs = []spec.Specification{spec.ProjectEqSpec(query.Project.ID)}

	asset, err := assetQuery.Get(mpID)
	if err != nil {
		return nil, err
	}

	var result openapivo.Asset
	str, _ := json.Marshal(asset)
	json.Unmarshal(str, &result)

	return &result, nil
}

func (query OpenApiQuery) GetMonitoringPoints(filters request.Filters) ([]openapivo.MonitoringPoint, error) {
	mpQuery := NewMonitoringPointQuery()
	mpQuery.Specs = []spec.Specification{spec.ProjectEqSpec(query.Project.ID)}
	for name, v := range filters {
		switch name {
		case "type":
			mpQuery.Specs = append(mpQuery.Specs, spec.TypeEqSpec(cast.ToUint(v)))
		case "asset_id":
			mpQuery.Specs = append(mpQuery.Specs, spec.AssetEqSpec(cast.ToUint(v)))
		}
	}

	mps, err := mpQuery.List()
	if err != nil {
		return nil, err
	}

	var result []openapivo.MonitoringPoint
	str, _ := json.Marshal(mps)
	json.Unmarshal(str, &result)

	return result, nil
}

func (query OpenApiQuery) GetMonitoringPoint(mpID uint) (*openapivo.MonitoringPoint, error) {
	mpQuery := NewMonitoringPointQuery()
	mpQuery.Specs = []spec.Specification{spec.ProjectEqSpec(query.Project.ID)}

	mp, err := mpQuery.Get(mpID)
	if err != nil {
		return nil, err
	}

	var result openapivo.MonitoringPoint
	str, _ := json.Marshal(mp)
	json.Unmarshal(str, &result)

	return &result, nil
}

func (query OpenApiQuery) FindAlarmRecords(page int, size int, from int64, to int64) ([]openapivo.AlarmRecord, int64, error) {
	arQuery := NewAlarmRecordQuery()
	arQuery.Specs = []spec.Specification{spec.ProjectEqSpec(query.Project.ID)}

	records, total, err := arQuery.Paging(page, size, from, to)
	if err != nil {
		return
	}

	var result []openapivo.AlarmRecord
	str, _ = json.Marshal(recrods)
	json.Unmarshal(str, &result)

	return result, total, nil
}
