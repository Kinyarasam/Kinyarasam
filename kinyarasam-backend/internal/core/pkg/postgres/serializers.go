package postgres

type PaginationParams struct {
	Page     int    `json:"page"`
	PageSize int    `json:"page_size"`
	RouteUrl string `json:"route_url"`
}

type Pagination struct {
	TotalItems   int    `json:"total_items"`
	StartIndex   int    `json:"start_index"`
	Page         int    `json:"page"`
	PageSize     int    `json:"page_size"`
	CurrentPage  string `json:"current_page"`
	NextPage     string `json:"next_page"`
	LastPage     string `json:"last_page"`
	PreviousPage string `json:"previous_page"`
}

type PaginatedResponse struct {
	Items      []interface{} `json:"items"`
	Pagination Pagination    `json:"pagination"`
}
