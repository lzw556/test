package measurement

import (
	"fmt"
	"github.com/thetasensors/theta-cloud-lite/server/domain/entity"
	"github.com/thetasensors/theta-cloud-lite/server/domain/po"
	"github.com/thetasensors/theta-cloud-lite/server/pkg/measurementtype"
	"strings"
)

type Vibration3AxisStrategy struct {
	strategy
	Type measurementtype.Vibration3Axis
}

func NewVibration3AxisStrategy() Strategy {
	return &Vibration3AxisStrategy{
		strategy: newStrategy(),
		Type:     measurementtype.Vibration3Axis{},
	}
}

func (s Vibration3AxisStrategy) Do(m po.Measurement) (entity.MeasurementData, error) {
	data, err := s.strategy.getLastSensorData(m)
	if err != nil {
		return entity.MeasurementData{}, err
	}
	if len(data.Values) <= 40 {
		return entity.MeasurementData{}, fmt.Errorf("not enough data [length = %d]", len(data.Values))
	}
	result := entity.MeasurementData{
		MeasurementID: m.ID,
		Time:          data.Time,
		Fields:        map[string]interface{}{},
	}
	for _, variable := range s.Type.Variables() {
		switch variable.Type {
		case measurementtype.FloatVariableType:
			result.Fields[variable.Name] = data.Values[variable.DataIndex]
		case measurementtype.AxisVariableType:
			if strings.HasPrefix(variable.Name, "fft") {
				result.Fields[variable.Name] = []float32{
					data.Values[variable.DataIndex],
					data.Values[variable.DataIndex+8],
					data.Values[variable.DataIndex+16],
				}
			} else {
				result.Fields[variable.Name] = []float32{
					data.Values[variable.DataIndex],
					data.Values[variable.DataIndex+16],
					data.Values[variable.DataIndex+32],
				}
			}
		}
	}
	return result, nil
}