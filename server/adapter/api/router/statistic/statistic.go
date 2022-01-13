package statistic

import "github.com/thetasensors/theta-cloud-lite/server/adapter/api/router"

type statisticRouter struct {
	service Service
	routes  []router.Route
}

func NewRouter(s Service) router.Router {
	r := statisticRouter{
		service: s,
	}
	r.initRoutes()
	return &r
}

func (r *statisticRouter) initRoutes() {
	r.routes = []router.Route{
		// GET
		router.NewGetRoute("statistics/measurements", r.statisticalMeasurements),
		router.NewGetRoute("statistics/measurements/:id/data", r.statisticalMeasurementData),
		router.NewGetRoute("statistics/measurements/:id/alert", r.statisticalMeasurementAlert),
		router.NewGetRoute("statistics/devices", r.statisticalDevices),
		router.NewGetRoute("statistics/alarmRecords", r.statisticalAlarmRecords),
	}
}

func (r statisticRouter) Routes() []router.Route {
	return r.routes
}