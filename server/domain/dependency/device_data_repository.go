package dependency

import (
	"github.com/thetasensors/theta-cloud-lite/server/domain/po"
	"time"
)

type DeviceDataRepository interface {
	Create(e po.DeviceData) error
	Find(deviceID uint, from, to time.Time) ([]po.DeviceData, error)
}
