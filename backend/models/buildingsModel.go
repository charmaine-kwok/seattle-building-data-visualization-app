package models

type Buildings struct {
	PropertyName        string
	PrimaryPropertyType string
	Address             string
	City                string
	NumberofFloors      int16
	CouncilDistrictCode int16
	YearBuilt           int16
	Latitude            float32
	Longitude           float32
}
