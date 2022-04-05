package command

import (
	"context"
	"github.com/gogo/protobuf/proto"
	pd "github.com/thetasensors/theta-cloud-lite/server/adapter/iot/proto"
	"time"
)

type clearDevicesCmd struct {
	request
}

func newClearDevicesCmd() clearDevicesCmd {
	return clearDevicesCmd{
		request: newRequest(),
	}
}

func (cmd clearDevicesCmd) Name() string {
	return "clearDevices"
}

func (cmd clearDevicesCmd) Response() string {
	return "clearDevicesResponse"
}

func (cmd clearDevicesCmd) Qos() byte {
	return 1
}

func (cmd clearDevicesCmd) Payload() []byte {
	m := pd.ClearDevicesCommand{
		Timestamp: int32(time.Now().UTC().Unix()),
		ReqId:     cmd.request.id,
	}
	payload, err := proto.Marshal(&m)
	if err != nil {
		return nil
	}
	return payload
}

func (cmd clearDevicesCmd) Execute(ctx context.Context, gateway string, target string, timeout time.Duration) ([]byte, error) {
	return cmd.request.do(ctx, gateway, target, cmd, timeout)
}
