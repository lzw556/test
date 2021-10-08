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
	deviceRepo  dependency.DeviceRepository
	networkRepo dependency.NetworkRepository
	next        Processor
}

func newRoot(p Processor) Processor {
	return root{
		deviceRepo:  repository.Device{},
		networkRepo: repository.Network{},
		next:        p,
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
	device, err := r.deviceRepo.GetBySpecs(c, spec.DeviceMacSpec(msg.Body.Device))
	if err != nil {
		return fmt.Errorf("device %s not found: %v", msg.Body.Device, err)
	}
	if device.NetworkID == 0 {
		return fmt.Errorf("device %s unregistered", device.MacAddress)
	}
	gateway, err := r.deviceRepo.GetBySpecs(c, spec.DeviceMacSpec(msg.Body.Gateway))
	if err != nil {
		return fmt.Errorf("gateway %s not found: %v", msg.Body.Gateway, err)
	}
	if gateway.NetworkID != device.NetworkID {
		return fmt.Errorf("device %s is not in gateway %s", device.MacAddress, gateway.MacAddress)
	}
	device.UpdateConnectionState(true)
	ctx.Set(device.MacAddress, device)
	ctx.Set(gateway.MacAddress, gateway)
	return nil
}
