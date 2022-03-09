// Code generated by "stringer -type=BusinessErrorCode"; DO NOT EDIT.

package errcode

import "strconv"

func _() {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	var x [1]struct{}
	_ = x[UnknownBusinessError-10000]
	_ = x[SystemNotReadyError-10001]
	_ = x[UserNotFoundError-11001]
	_ = x[InvalidUsernameOrPasswordError-11002]
	_ = x[InvalidOldPasswordError-11003]
	_ = x[UserExistsError-11004]
	_ = x[InvalidTokenError-11005]
	_ = x[AssetNotFoundError-12001]
	_ = x[AssetImageSizeTooLargeError-12002]
	_ = x[DeviceNotFoundError-13001]
	_ = x[DeviceMacExistsError-13002]
	_ = x[UnknownDeviceTypeError-13003]
	_ = x[DeviceCommandSendFailedError-13004]
	_ = x[DeviceCommandSendTimeoutError-13005]
	_ = x[DeviceCommandExecFailedError-13006]
	_ = x[DeviceCommandCancelledError-13007]
	_ = x[UnknownDeviceCommandTypeError-13008]
	_ = x[DeviceOfflineError-13009]
	_ = x[FirmwareNotFoundError-14001]
	_ = x[FirmwareFormatError-14002]
	_ = x[FirmwareExistsError-14003]
	_ = x[NetworkNotFoundError-15001]
	_ = x[AlarmRuleNameExists-16001]
	_ = x[AlarmRuleNotFoundError-16002]
	_ = x[AlarmRecordAlreadyAcknowledgedError-16003]
	_ = x[RoleExistsError-17001]
	_ = x[RoleNotFoundError-17002]
	_ = x[MeasurementNotFoundError-18001]
	_ = x[UnknownMeasurementTypeError-18002]
	_ = x[MeasurementUnboundDeviceError-18003]
	_ = x[ProjectNotFoundError-19001]
	_ = x[ProjectExistsError-19002]
	_ = x[ProjectNotSelectedError-19003]
}

const (
	_BusinessErrorCode_name_0 = "UnknownBusinessErrorSystemNotReadyError"
	_BusinessErrorCode_name_1 = "UserNotFoundErrorInvalidUsernameOrPasswordErrorInvalidOldPasswordErrorUserExistsErrorInvalidTokenError"
	_BusinessErrorCode_name_2 = "AssetNotFoundErrorAssetImageSizeTooLargeError"
	_BusinessErrorCode_name_3 = "DeviceNotFoundErrorDeviceMacExistsErrorUnknownDeviceTypeErrorDeviceCommandSendFailedErrorDeviceCommandSendTimeoutErrorDeviceCommandExecFailedErrorDeviceCommandCancelledErrorUnknownDeviceCommandTypeErrorDeviceOfflineError"
	_BusinessErrorCode_name_4 = "FirmwareNotFoundErrorFirmwareFormatErrorFirmwareExistsError"
	_BusinessErrorCode_name_5 = "NetworkNotFoundError"
	_BusinessErrorCode_name_6 = "AlarmRuleNameExistsAlarmRuleNotFoundErrorAlarmRecordAlreadyAcknowledgedError"
	_BusinessErrorCode_name_7 = "RoleExistsErrorRoleNotFoundError"
	_BusinessErrorCode_name_8 = "MeasurementNotFoundErrorUnknownMeasurementTypeErrorMeasurementUnboundDeviceError"
	_BusinessErrorCode_name_9 = "ProjectNotFoundErrorProjectExistsErrorProjectNotSelectedError"
)

var (
	_BusinessErrorCode_index_0 = [...]uint8{0, 20, 39}
	_BusinessErrorCode_index_1 = [...]uint8{0, 17, 47, 70, 85, 102}
	_BusinessErrorCode_index_2 = [...]uint8{0, 18, 45}
	_BusinessErrorCode_index_3 = [...]uint8{0, 19, 39, 61, 89, 118, 146, 173, 202, 220}
	_BusinessErrorCode_index_4 = [...]uint8{0, 21, 40, 59}
	_BusinessErrorCode_index_6 = [...]uint8{0, 19, 41, 76}
	_BusinessErrorCode_index_7 = [...]uint8{0, 15, 32}
	_BusinessErrorCode_index_8 = [...]uint8{0, 24, 51, 80}
	_BusinessErrorCode_index_9 = [...]uint8{0, 20, 38, 61}
)

func (i BusinessErrorCode) String() string {
	switch {
	case 10000 <= i && i <= 10001:
		i -= 10000
		return _BusinessErrorCode_name_0[_BusinessErrorCode_index_0[i]:_BusinessErrorCode_index_0[i+1]]
	case 11001 <= i && i <= 11005:
		i -= 11001
		return _BusinessErrorCode_name_1[_BusinessErrorCode_index_1[i]:_BusinessErrorCode_index_1[i+1]]
	case 12001 <= i && i <= 12002:
		i -= 12001
		return _BusinessErrorCode_name_2[_BusinessErrorCode_index_2[i]:_BusinessErrorCode_index_2[i+1]]
	case 13001 <= i && i <= 13009:
		i -= 13001
		return _BusinessErrorCode_name_3[_BusinessErrorCode_index_3[i]:_BusinessErrorCode_index_3[i+1]]
	case 14001 <= i && i <= 14003:
		i -= 14001
		return _BusinessErrorCode_name_4[_BusinessErrorCode_index_4[i]:_BusinessErrorCode_index_4[i+1]]
	case i == 15001:
		return _BusinessErrorCode_name_5
	case 16001 <= i && i <= 16003:
		i -= 16001
		return _BusinessErrorCode_name_6[_BusinessErrorCode_index_6[i]:_BusinessErrorCode_index_6[i+1]]
	case 17001 <= i && i <= 17002:
		i -= 17001
		return _BusinessErrorCode_name_7[_BusinessErrorCode_index_7[i]:_BusinessErrorCode_index_7[i+1]]
	case 18001 <= i && i <= 18003:
		i -= 18001
		return _BusinessErrorCode_name_8[_BusinessErrorCode_index_8[i]:_BusinessErrorCode_index_8[i+1]]
	case 19001 <= i && i <= 19003:
		i -= 19001
		return _BusinessErrorCode_name_9[_BusinessErrorCode_index_9[i]:_BusinessErrorCode_index_9[i+1]]
	default:
		return "BusinessErrorCode(" + strconv.FormatInt(int64(i), 10) + ")"
	}
}
