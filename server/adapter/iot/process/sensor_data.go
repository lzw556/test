package process

import (
	"fmt"
	"github.com/gogo/protobuf/proto"
	"github.com/thetasensors/theta-cloud-lite/server/adapter/iot"
	pd "github.com/thetasensors/theta-cloud-lite/server/adapter/iot/proto"
	"github.com/thetasensors/theta-cloud-lite/server/adapter/repository"
	"github.com/thetasensors/theta-cloud-lite/server/domain/dependency"
	"github.com/thetasensors/theta-cloud-lite/server/domain/entity"
	"github.com/thetasensors/theta-cloud-lite/server/domain/po"
	"sync"
	"time"
)

var mu sync.RWMutex

type SensorData struct {
	deviceRepo     dependency.DeviceRepository
	deviceDataRepo dependency.DeviceDataRepository
}

func NewSensorData() Processor {
	return newRoot(SensorData{
		deviceRepo:     repository.Device{},
		deviceDataRepo: repository.DeviceData{},
	})
}

func (p SensorData) Name() string {
	return "SensorData"
}

func (p SensorData) Next() Processor {
	return nil
}

func (p SensorData) Process(ctx *iot.Context, msg iot.Message) error {
	m := pd.SensorDataMessage{}
	if err := proto.Unmarshal(msg.Body.Payload, &m); err != nil {
		return fmt.Errorf("unmarshal [SensorData] message failed: %v", err)
	}
	if value, ok := ctx.Get(msg.Body.Device); ok {
		if device, ok := value.(entity.Device); ok {
			e := po.DeviceData{
				Time:       time.Unix(int64(m.Timestamp), int64(m.Usec*1000)),
				MacAddress: device.MacAddress,
				SensorType: uint(m.SensorId),
				Values:     m.GetValues(),
			}
			mu.Lock()
			defer mu.Unlock()
			if err := p.deviceDataRepo.Create(e); err != nil {
				return fmt.Errorf("save device %s data failed: %v", device.MacAddress, err)
			}
		}
	}
	return nil
}
