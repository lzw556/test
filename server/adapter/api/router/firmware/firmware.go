package firmware

import "github.com/thetasensors/theta-cloud-lite/server/adapter/api/router"

type firmwareRouter struct {
	service Service
	routes  []router.Route
}

func NewRouter(s Service) router.Router {
	r := firmwareRouter{
		service: s,
	}
	r.initRoutes()
	return &r
}

func (r *firmwareRouter) initRoutes() {
	r.routes = []router.Route{
		// POST
		router.NewPostRoute("firmwares", r.create),

		// GET
		router.NewGetRoute("firmwares", r.paging),

		// DELETE
		router.NewDeleteRoute("firmwares/:id", r.removeByID),
	}
}

func (r *firmwareRouter) Routes() []router.Route {
	return r.routes
}
