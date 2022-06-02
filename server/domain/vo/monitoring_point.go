package vo

import (
	"github.com/thetasensors/theta-cloud-lite/server/domain/entity"
)

type MonitoringPoint struct {
	ID      uint   `json:"id"`
	Name    string `json:"name"`
	Type    uint   `json:"type"`
	AssetID uint   `json:"assetId"`

	Attributes     map[string]interface{} `json:"attributes,omitempty"`
	BindingDevices []*Device              `json:"bindingDevices,omitempty"`
	Properties     MPProperties           `json:"properties,omitempty"`
	Data           *MonitoringPointData   `json:"data,omitempty"`
}

func NewMonitoringPoint(e entity.MonitoringPoint) MonitoringPoint {
	return MonitoringPoint{
		ID:         e.ID,
		Name:       e.Name,
		Type:       e.Type,
		AssetID:    e.AssetID,
		Attributes: e.Attributes,
	}
}