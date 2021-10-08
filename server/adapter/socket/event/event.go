package event

type Event interface {
	Name() string
	Namespace() string
	Handler()
}
