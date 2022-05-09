package devicetype

type BoltLoosening struct{}

func (BoltLoosening) ID() uint {
	return BoltLooseningType
}

func (BoltLoosening) SensorID() uint {
	return BoltAngleSensor
}

func (BoltLoosening) Settings() Settings {
	return []Setting{
		{
			Name:     "采样周期",
			Key:      "sample_period",
			Type:     Uint32ValueType,
			Value:    1200000, // 20 minutes
			Options:  samplePeriodOption1,
			Category: SensorsSettingCategory,
			Group:    SettingGroupGeneral,
			Sort:     0,
		},
	}
}

func (BoltLoosening) Properties(sensorID uint) Properties {
	switch sensorID {
	case BoltAngleSensor:
		return Properties{
			{
				Key:       "loosening_angle",
				Name:      "松动角度",
				Unit:      "°",
				Precision: 3,
				Sort:      0,
				IsShow:    true,
				Fields: []Field{
					{
						Name:      "松动角度",
						Key:       "loosening_angle",
						DataIndex: 0,
					},
				},
			},
			{
				Key:       "absolute_angle",
				Name:      "绝对角度",
				Unit:      "°",
				Precision: 3,
				Sort:      1,
				IsShow:    true,
				Fields: []Field{
					{
						Name:      "绝对角度",
						Key:       "absolute_angle",
						DataIndex: 1,
					},
				},
			},
			{
				Key:       "attitude",
				Name:      "姿态指数",
				Unit:      "",
				Precision: 3,
				Sort:      2,
				IsShow:    true,
				Fields: []Field{
					{
						Name:      "姿态指数",
						Key:       "attitude",
						DataIndex: 8,
					},
				},
			},
			{
				Key:       "attitude_abs",
				Name:      "姿态指数绝对值",
				Unit:      "",
				Precision: 3,
				Sort:      3,
				IsShow:    true,
				Fields: []Field{
					{
						Key:       "attitude_abs_x",
						Name:      "X轴",
						DataIndex: 6,
					},
					{
						Key:       "attitude_abs_y",
						Name:      "Y轴",
						DataIndex: 7,
					},
					{
						Key:       "attitude_abs_z",
						Name:      "Z轴",
						DataIndex: 9,
					},
				},
			},
			{
				Key:       "motion",
				Name:      "移动指数",
				Unit:      "",
				Precision: 3,
				Sort:      4,
				IsShow:    true,
				Fields: []Field{
					{
						Name:      "移动指数",
						Key:       "motion",
						DataIndex: 5,
					},
				},
			},
			{
				Key:       "motion_abs",
				Name:      "移动指数绝对值",
				Unit:      "",
				Precision: 3,
				Sort:      5,
				IsShow:    true,
				Fields: []Field{
					{
						Key:       "motion_abs_x",
						Name:      "X轴",
						DataIndex: 2,
					},
					{
						Key:       "motion_abs_y",
						Name:      "Y轴",
						DataIndex: 3,
					},
					{
						Key:       "motion_abs_z",
						Name:      "Z轴",
						DataIndex: 4,
					},
				},
			},
			{
				Key:       "temperature",
				Name:      "温度",
				Unit:      "°C",
				Precision: 3,
				Sort:      3,
				IsShow:    true,
				Fields: []Field{
					{
						Name:      "温度",
						Key:       "temperature",
						DataIndex: 10,
					},
				},
			},
		}
	}
	return nil
}
