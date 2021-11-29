package initialize

import (
	"github.com/thetasensors/theta-cloud-lite/server/domain/po"
	"github.com/thetasensors/theta-cloud-lite/server/pkg/devicetype"
	"gorm.io/gorm"
	"reflect"
)

func InitTables(db *gorm.DB) error {
	tables := []interface{}{
		&po.User{},
		&po.Role{},
		&po.Menu{},
		&po.RoleMenuRelation{},
		&po.Asset{},
		&po.Device{},
		&po.Property{},
		&po.Network{},
		&po.Firmware{},
		&po.AlarmRule{},
		&po.AlarmRuleTemplate{},
		&po.AlarmRecord{},
		&po.AlarmRecordAcknowledge{},
	}
	//db.Migrator().DropTable(&po.Menu{}, &po.RoleMenuRelation{})
	for _, table := range tables {
		if !db.Migrator().HasTable(table) {
			if err := db.Migrator().CreateTable(table); err != nil {
				return err
			}
		} else {
			t := reflect.TypeOf(table)
			if t.Kind() == reflect.Ptr {
				t = t.Elem()
			}
			if t.Kind() == reflect.Struct {
				for i := 0; i < t.NumField(); i++ {
					name := t.Field(i).Name
					if !db.Migrator().HasColumn(table, name) && name != "Model" && t.Field(i).Tag.Get("gorm") != "-" {
						if err := db.Migrator().AddColumn(table, name); err != nil {
							return err
						}
					}
				}
			}
		}
	}
	if err := initUser(db); err != nil {
		return err
	}
	if err := initProperties(db); err != nil {
		return err
	}
	if err := initMenus(db); err != nil {
		return err
	}
	return nil
}

func initUser(db *gorm.DB) error {
	user := po.User{
		Username: "admin",
		Password: "123456",
	}
	err := db.FirstOrCreate(&user, map[string]interface{}{"id": 1, "username": user.Username}).Error
	if err != nil {
		return err
	}
	return err
}

func initProperties(db *gorm.DB) error {
	properties := []po.Property{
		{
			Name:         "松动角度",
			DeviceTypeID: devicetype.BoltLooseningType,
			SensorType:   devicetype.BoltAngleSensor,
			Unit:         "°",
			Precision:    3,
			Fields: po.Fields{
				"loosening_angle": 1,
			},
		},
		{
			Name:         "姿态指数",
			DeviceTypeID: devicetype.BoltLooseningType,
			SensorType:   devicetype.BoltAngleSensor,
			Unit:         "",
			Precision:    3,
			Fields: po.Fields{
				"attitude": 5,
			},
		},
		{
			Name:         "移动指数",
			DeviceTypeID: devicetype.BoltLooseningType,
			SensorType:   devicetype.BoltAngleSensor,
			Unit:         "",
			Precision:    3,
			Fields: po.Fields{
				"motion": 8,
			},
		},
		{
			Name:         "预紧力",
			DeviceTypeID: devicetype.BoltElongationType,
			SensorType:   devicetype.LengthAttitudeAccelerationSensor,
			Unit:         "kN",
			Precision:    3,
			Fields: po.Fields{
				"preload": 5,
			},
		},
		{
			Name:         "缺陷位置",
			DeviceTypeID: devicetype.BoltElongationType,
			SensorType:   devicetype.LengthAttitudeAccelerationSensor,
			Unit:         "mm",
			Precision:    3,
			Fields: po.Fields{
				"defection": 6,
			},
		},
		{
			Name:         "长度",
			DeviceTypeID: devicetype.BoltElongationType,
			SensorType:   devicetype.LengthAttitudeAccelerationSensor,
			Unit:         "mm",
			Precision:    3,
			Fields: po.Fields{
				"length": 0,
			},
		},
		{
			Name:         "温度",
			DeviceTypeID: devicetype.BoltElongationType,
			SensorType:   devicetype.LengthAttitudeAccelerationSensor,
			Unit:         "°C",
			Precision:    3,
			Fields: po.Fields{
				"temperature": 1,
			},
		},
		{
			Name:         "飞行时间",
			DeviceTypeID: devicetype.BoltElongationType,
			SensorType:   devicetype.LengthAttitudeAccelerationSensor,
			Unit:         "ns",
			Precision:    3,
			Fields: po.Fields{
				"tof": 2,
			},
		},
		{
			Name:         "加速度",
			DeviceTypeID: devicetype.BoltElongationType,
			SensorType:   devicetype.LengthAttitudeAccelerationSensor,
			Unit:         "m/s²",
			Precision:    3,
			Fields: po.Fields{
				"acceleration_x": 7,
				"acceleration_y": 8,
				"acceleration_z": 9,
			},
		},
		{
			Name:         "厚度",
			DeviceTypeID: devicetype.NormalTemperatureCorrosionType,
			SensorType:   devicetype.ThicknessSensor,
			Unit:         "mm",
			Precision:    3,
			Fields: po.Fields{
				"thickness": 0,
			},
		},
		{
			Name:         "腐蚀率",
			DeviceTypeID: devicetype.NormalTemperatureCorrosionType,
			SensorType:   devicetype.ThicknessSensor,
			Unit:         "mm/a",
			Precision:    3,
			Fields: po.Fields{
				"corrosion_rate": 0,
			},
		},
		{
			Name:         "温度",
			DeviceTypeID: devicetype.NormalTemperatureCorrosionType,
			SensorType:   devicetype.ThicknessSensor,
			Unit:         "°C",
			Precision:    3,
			Fields: po.Fields{
				"temperature": 1,
			},
		},
		{
			Name:         "飞行时间",
			DeviceTypeID: devicetype.NormalTemperatureCorrosionType,
			SensorType:   devicetype.ThicknessSensor,
			Unit:         "ns",
			Precision:    3,
			Fields: po.Fields{
				"tof": 2,
			},
		},
		{
			Name:         "厚度",
			DeviceTypeID: devicetype.HighTemperatureCorrosionType,
			SensorType:   devicetype.ThicknessSensor,
			Unit:         "mm",
			Precision:    3,
			Fields: po.Fields{
				"thickness": 0,
			},
		},
		{
			Name:         "腐蚀率",
			DeviceTypeID: devicetype.HighTemperatureCorrosionType,
			SensorType:   devicetype.ThicknessSensor,
			Unit:         "mm/a",
			Precision:    3,
			Fields: po.Fields{
				"corrosion_rate": 0,
			},
		},
		{
			Name:         "温度",
			DeviceTypeID: devicetype.HighTemperatureCorrosionType,
			SensorType:   devicetype.ThicknessSensor,
			Unit:         "°C",
			Precision:    3,
			Fields: po.Fields{
				"temperature": 1,
			},
		},
		{
			Name:         "飞行时间",
			DeviceTypeID: devicetype.HighTemperatureCorrosionType,
			SensorType:   devicetype.ThicknessSensor,
			Unit:         "ns",
			Precision:    3,
			Fields: po.Fields{
				"tof": 2,
			},
		},
		{
			Name:         "角度",
			DeviceTypeID: devicetype.AngleDipType,
			SensorType:   devicetype.SCL3300Sensor,
			Unit:         "°",
			Precision:    3,
			Fields: po.Fields{
				"inclination": 0,
				"pitch":       1,
				"roll":        2,
			},
		},
		{
			Name:         "速度",
			DeviceTypeID: devicetype.VibrationTemperature3AxisType,
			SensorType:   devicetype.VibrationRmsFFTXYZTemperatureSensor,
			Unit:         "mm/s",
			Precision:    3,
			Fields: po.Fields{
				"velocity_x": 1,
				"velocity_y": 6,
				"velocity_z": 11,
			},
		},
		{
			Name:         "加速度",
			DeviceTypeID: devicetype.VibrationTemperature3AxisType,
			SensorType:   devicetype.VibrationRmsFFTXYZTemperatureSensor,
			Unit:         "m/s²",
			Precision:    3,
			Fields: po.Fields{
				"acceleration_x": 0,
				"acceleration_y": 5,
				"acceleration_z": 10,
			},
		},
		{
			Name:         "位移",
			DeviceTypeID: devicetype.VibrationTemperature3AxisType,
			SensorType:   devicetype.VibrationRmsFFTXYZTemperatureSensor,
			Unit:         "mm",
			Precision:    3,
			Fields: po.Fields{
				"displacement_x": 2,
				"displacement_y": 7,
				"displacement_z": 12,
			},
		},
		{
			Name:         "真峰峰值",
			DeviceTypeID: devicetype.VibrationTemperature3AxisType,
			SensorType:   devicetype.VibrationRmsFFTXYZTemperatureSensor,
			Unit:         "gE",
			Precision:    3,
			Fields: po.Fields{
				"enveloping_x": 3,
				"enveloping_y": 8,
				"enveloping_z": 13,
			},
		},
		{
			Name:         "波峰因数",
			DeviceTypeID: devicetype.VibrationTemperature3AxisType,
			SensorType:   devicetype.VibrationRmsFFTXYZTemperatureSensor,
			Unit:         "",
			Precision:    3,
			Fields: po.Fields{
				"crest_factor_x": 4,
				"crest_factor_y": 9,
				"crest_factor_z": 14,
			},
		},
		{
			Name:         "温度",
			DeviceTypeID: devicetype.VibrationTemperature3AxisType,
			SensorType:   devicetype.VibrationRmsFFTXYZTemperatureSensor,
			Unit:         "°C",
			Precision:    3,
			Fields: po.Fields{
				"temperature": 39,
			},
		},
	}
	for _, property := range properties {
		err := db.FirstOrCreate(&property, map[string]interface{}{"name": property.Name, "device_type_id": property.DeviceTypeID, "sensor_type": property.SensorType}).Error
		if err != nil {
			return err
		}
	}
	return nil
}

func initMenus(db *gorm.DB) error {
	menus := []po.Menu{
		{
			ID:       1,
			Title:    "系统管理",
			Name:     "system-management",
			ParentID: 0,
			Icon:     "icon-system",
			IsAuth:   true,
			Hidden:   false,
			Sort:     10,
		},
		{
			ID:       2,
			Title:    "角色管理",
			Name:     "roles",
			View:     "Role",
			Path:     "/system-management",
			ParentID: 1,
			IsAuth:   true,
			Hidden:   false,
		},
		{
			ID:       4,
			Title:    "系统状态",
			Name:     "systemInfo",
			View:     "System",
			Path:     "/system-management",
			ParentID: 1,
			IsAuth:   true,
			Hidden:   false,
		},
		{
			ID:       5,
			Title:    "资产管理",
			Name:     "asset-management",
			ParentID: 0,
			Icon:     "icon-asset-management",
			IsAuth:   true,
			Hidden:   false,
			Sort:     0,
		},
		{
			ID:       6,
			Title:    "概览",
			Name:     "assetOverview",
			ParentID: 5,
			View:     "AssetOverview",
			Path:     "/asset-management",
			IsAuth:   true,
			Hidden:   false,
		},
		{
			ID:       7,
			Title:    "资产列表",
			Name:     "assets",
			ParentID: 5,
			View:     "Asset",
			Path:     "/asset-management",
		},
		{
			ID:     8,
			Title:  "设备管理",
			Name:   "device-management",
			Icon:   "icon-device-management",
			IsAuth: true,
			Hidden: false,
			Sort:   1,
		},
		{
			ID:       9,
			Title:    "设备列表",
			Name:     "devices",
			ParentID: 8,
			Path:     "/device-management",
			View:     "Device",
			IsAuth:   true,
			Hidden:   false,
		},
		{
			ID:       10,
			Title:    "添加设备",
			Name:     "addDevice",
			ParentID: 8,
			Path:     "/device-management",
			View:     "AddDevice",
			IsAuth:   true,
			Hidden:   false,
		},
		{
			ID:       22,
			Title:    "设备详情",
			Name:     "deviceDetail",
			ParentID: 8,
			Path:     "/device-management",
			View:     "DeviceDetail",
			IsAuth:   true,
			Hidden:   true,
		},
		{
			ID:       11,
			Title:    "固件列表",
			Name:     "firmwares",
			ParentID: 8,
			Path:     "/device-management",
			View:     "Firmware",
			IsAuth:   true,
			Hidden:   false,
		},
		{
			ID:       12,
			Title:    "网络管理",
			Name:     "network-management",
			ParentID: 0,
			Icon:     "icon-network-management",
			IsAuth:   true,
			Hidden:   false,
			Sort:     2,
		},
		{
			ID:       13,
			Title:    "网络列表",
			Name:     "networks",
			ParentID: 12,
			Path:     "/network-management",
			View:     "Network",
			IsAuth:   true,
			Hidden:   false,
		},
		{
			ID:       14,
			Title:    "导入网络",
			Name:     "importNetwork",
			ParentID: 12,
			Path:     "/network-management",
			View:     "ImportNetwork",
			IsAuth:   true,
			Hidden:   false,
		},
		{
			ID:       15,
			Title:    "数据管理",
			Name:     "data-management",
			ParentID: 0,
			Icon:     "icon-data-management",
			IsAuth:   true,
			Hidden:   false,
			Sort:     3,
		},
		{
			ID:       16,
			Title:    "历史数据",
			Name:     "historyData",
			ParentID: 15,
			Path:     "/data-management",
			View:     "HistoryData",
			IsAuth:   true,
			Hidden:   false,
		},
		{
			ID:       17,
			Title:    "报警管理",
			Name:     "alarm-management",
			ParentID: 0,
			Icon:     "icon-alarm-management",
			IsAuth:   true,
			Hidden:   false,
			Sort:     4,
		},
		{
			ID:       18,
			Title:    "报警列表",
			Name:     "alerts",
			ParentID: 17,
			Path:     "/alarm-management",
			View:     "AlarmRecord",
			IsAuth:   true,
			Hidden:   false,
		},
		{
			ID:       19,
			Title:    "报警规则",
			Name:     "alarmRules",
			ParentID: 17,
			Path:     "/alarm-management",
			View:     "AlarmRule",
			IsAuth:   true,
			Hidden:   false,
		},
		{
			ID:       20,
			Title:    "用户管理",
			Name:     "users",
			ParentID: 0,
			Icon:     "icon-user-management",
			Path:     "/user-management",
			View:     "User",
			IsAuth:   true,
			Hidden:   false,
			Sort:     5,
		},
		{
			ID:       21,
			Title:    "个人中心",
			Name:     "me",
			ParentID: 0,
			Icon:     "icon-me",
			Path:     "/user-management",
			View:     "Me",
			IsAuth:   true,
			Hidden:   false,
			Sort:     6,
		},
	}
	for _, menu := range menus {
		err := db.FirstOrCreate(&menu, map[string]interface{}{"id": menu.ID}).Error
		if err != nil {
			return err
		}
	}
	return nil
}
