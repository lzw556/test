package command

import (
	"github.com/gogo/protobuf/proto"
	"github.com/thetasensors/theta-cloud-lite/server/adapter/iot"
	pd "github.com/thetasensors/theta-cloud-lite/server/adapter/iot/proto"
	"github.com/thetasensors/theta-cloud-lite/server/pkg/eventbus"
	"github.com/thetasensors/theta-cloud-lite/server/pkg/xlog"
)

type UpdateDeviceResponse struct {
}

func NewUpdateDeviceResponse() UpdateDeviceResponse {
	return UpdateDeviceResponse{}
}

func (d UpdateDeviceResponse) Name() string {
	return "updateDeviceResponse"
}

func (d UpdateDeviceResponse) Dispatch(msg iot.Message) {
	m := pd.GeneralResponseMessage{}
	if err := proto.Unmarshal(msg.Body.Payload, &m); err != nil {
		xlog.Errorf("unmarshal [%s] message failed: %v", d.Name(), err)
		return
	}
	response := Response{
		Code: int(m.Code),
	}
	eventbus.Publish(m.ReqId, response)
}