package command

import (
	"github.com/gogo/protobuf/proto"
	"github.com/thetasensors/theta-cloud-lite/server/adapter/iot"
	pd "github.com/thetasensors/theta-cloud-lite/server/adapter/iot/proto"
	"github.com/thetasensors/theta-cloud-lite/server/pkg/eventbus"
	"github.com/thetasensors/theta-cloud-lite/server/pkg/xlog"
)

type ResetDataResponse struct {
}

func NewResetDataResponse() ResetDataResponse {
	return ResetDataResponse{}
}

func (d ResetDataResponse) Name() string {
	return "resetDataResponse"
}

func (d ResetDataResponse) Dispatch(msg iot.Message) {
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
