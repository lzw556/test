package alarm

import "github.com/thetasensors/theta-cloud-lite/server/adapter/api/router"

type alarmRouter struct {
	service Service
	routes  []router.Route
}

func NewRouter(s Service) router.Router {
	r := alarmRouter{
		service: s,
	}
	r.initRoutes()
	return &r
}

func (r *alarmRouter) initRoutes() {
	r.routes = []router.Route{
		// POST
		router.NewPostRoute("alarmRules", r.createAlarmRule),
		router.NewPostRoute("alarmRules/:id/sources", r.addSourcesToAlarmRule),
		router.NewPostRoute("alarmRecords/:id/acknowledge", r.acknowledgeAlarmRecord),

		// GET
		router.NewGetRoute("alarmRules", r.findAlarmRules),
		router.NewGetRoute("alarmRules/:id", r.getAlarmRule),

		router.NewGetRoute("alarmRecords", r.findAlarmRecords),
		router.NewGetRoute("alarmRecords/:id/acknowledge", r.getAlarmRecordAcknowledge),

		router.NewGetRoute("check/alarmRules/:name", r.checkAlarmRuleName),

		//PUT
		router.NewPutRoute("alarmRules/:id", r.updateAlarmRule),
		router.NewPutRoute("alarmRules/:id/status/:status", r.updateAlarmRuleStatus),

		//DELETE
		router.NewDeleteRoute("alarmRules/:id", r.deleteAlarmRule),
		router.NewDeleteRoute("alarmRules/:id/sources", r.removeSourcesFromAlarmRule),
		router.NewDeleteRoute("alarmRecords/:id", r.deleteAlarmRecord),
	}
}

func (r *alarmRouter) Routes() []router.Route {
	return r.routes
}
