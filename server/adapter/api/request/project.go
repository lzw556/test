package request

type Project struct {
	Name        string `json:"name" binding:"required,max=16,min=4"`
	Description string `json:"description"`
}

type AllocUsers struct {
	UserIDs []uint `json:"user_ids"`
}
