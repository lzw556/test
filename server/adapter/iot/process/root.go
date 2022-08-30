package process

import (
	"context"
	"fmt"
	"github.com/thetasensors/theta-cloud-lite/server/adapter/iot"
	"github.com/thetasensors/theta-cloud-lite/server/adapter/repository"
	"github.com/thetasensors/theta-cloud-lite/server/domain/dependency"
	spec "github.com/thetasensors/theta-cloud-lite/server/domain/specification"
)

type root struct {
	deviceRepo      dependency.DeviceRepository
	deviceStateRepo dependency.DeviceStateRepository
	networkRepo     dependency.NetworkRepository
	next            Processor
}

func newRoot(p Processor) Processor {
	return root{
		deviceRepo:      repository.Device{},
		deviceStateRepo: repository.DeviceState{},
		networkRepo:     repository.Network{},
		next:            p,
	}
}

func (r root) Name() string {
	return "default"
}

func (r root) Next() Processor {
	return r.next
}

func (r root) Process(ctx *iot.Context, msg iot.Message) error {
	c := context.TODO()
	if msg.Body.Device == "000000000000" {
		return fmt.Errorf("invalid device mac address => [%s]", msg.Body.Device)
	}
	device, err := r.deviceRepo.GetBySpecs(c, spec.DeviceMacEqSpec(msg.Body.Device))
	if err != nil {
		return fmt.Errorf("device %s not found: %v", msg.Body.Device, err)
	}
	if !device.IsNB() {
		gateway, err := r.deviceRepo.GetBySpecs(c, spec.DeviceMacEqSpec(msg.Body.Gateway))
		if err != nil {
			return fmt.Errorf("gateway %s not found: %v", msg.Body.Gateway, err)
		}
		if gateway.NetworkID != device.NetworkID {
			return fmt.Errorf("device %s is not in gateway %s", device.MacAddress, gateway.MacAddress)
		}
		ctx.Set(gateway.MacAddress, gateway)
	}
	ctx.Set(device.MacAddress, device)
	return nil
}
