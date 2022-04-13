package entity

type SqRawData struct {
	Metadata struct {
		Odr             uint16  `json:"odr" mapstructure:"odr"`
		Number          uint16  `json:"number" mapstructure:"number"`
		MeanInclination float32 `json:"mean_inclination" mapstructure:"mean_inclination"`
		MeanPitch       float32 `json:"mean_pitch" mapstructure:"mean_pitch"`
		MeanRoll        float32 `json:"mean_roll" mapstructure:"mean_roll"`
	} `json:"metadata" mapstructure:"metadata"`
	Values             []float64 `json:"values" mapstructure:"values"`
	DynamicInclination []float32 `json:"dynamic_inclination" mapstructure:"dynamic_inclination"`
	DynamicPitch       []float32 `json:"dynamic_pitch" mapstructure:"dynamic_pitch"`
	DynamicRoll        []float32 `json:"dynamic_roll" mapstructure:"dynamic_roll"`
}
