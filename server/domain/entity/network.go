package entity

import (
	"database/sql/driver"
	"errors"
	"fmt"
	"github.com/thetasensors/theta-cloud-lite/server/pkg/json"
	"gorm.io/gorm"
)

type NetworkMode uint8

const (
	NetworkModePushing NetworkMode = iota + 1
	NetworkModePulling
)

type Network struct {
	gorm.Model
	Name                    string `gorm:"type:varchar(64)"`
	ProjectID               uint
	GatewayID               uint
	CommunicationPeriod     uint `gorm:"default:0;not null;"`
	CommunicationTimeOffset uint `gorm:"default:0;not null;"`
	GroupSize               uint `gorm:"default:4;not null;"`
	GroupInterval           uint
	Mode                    NetworkMode `gorm:"default:1;not null;"`
	SyncTimestamp           int64
	Gateway                 Device `gorm:"-"`
}

func (Network) TableName() string {
	return "ts_network"
}

type Networks []Network

type RoutingTable [2]string
type RoutingTables []RoutingTable

func (s RoutingTables) Value() (driver.Value, error) {
	return json.Marshal(s)
}

func (s *RoutingTables) Scan(v interface{}) error {
	bytes, ok := v.([]byte)
	if !ok {
		return errors.New(fmt.Sprint("failed to unmarshal RoutingTables value:", v))
	}
	return json.Unmarshal(bytes, s)
}
