package vo

import (
	"fmt"
	"github.com/thetasensors/theta-cloud-lite/server/domain/entity"
	"github.com/thetasensors/theta-cloud-lite/server/pkg/json"
)

type DeviceEvent struct {
	ID        uint   `json:"id"`
	Name      string `json:"name"`
	Message   string `json:"message"`
	Content   string `json:"content"`
	Timestamp int64  `json:"timestamp"`
}

func NewDeviceEvent(e entity.Event) DeviceEvent {
	event := DeviceEvent{
		ID:        e.ID,
		Name:      e.Code.String(),
		Content:   e.Content,
		Timestamp: e.Timestamp,
	}
	content := struct {
		Code int `json:"code"`
	}{}
	if err := json.Unmarshal([]byte(e.Content), &content); err != nil {
		return event
	}
	if message, ok := eventMessage[e.Code][content.Code]; ok {
		event.Message = message
	} else {
		event.Message = fmt.Sprintf("%s(错误码: %d)", e.Code.String(), content.Code)
	}
	return event
}

type DeviceEventList []DeviceEvent

func (list DeviceEventList) Len() int {
	return len(list)
}

func (list DeviceEventList) Less(i, j int) bool {
	return list[i].Timestamp < list[j].Timestamp
}

func (list DeviceEventList) Swap(i, j int) {
	list[i], list[j] = list[j], list[i]
}
