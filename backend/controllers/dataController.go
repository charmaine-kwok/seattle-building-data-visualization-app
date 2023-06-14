package controllers

import (
	"api/initializers"
	"api/models"
	"fmt"
	"log"
	"math"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CloseDB() {
	sqlDB, err := initializers.DB.DB()
	if err != nil {
		log.Fatalln(err)
	}
	sqlDB.Close()
}

// API to get the list of building property name
func GetBuildings(c *gin.Context) {
	// Get the "page" parameter from the query string, with a default value of 1
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Calculate the offset
	const perPage = 10
	offset := (page - 1) * perPage

	// Fetch the data from the database
	var buildings []string
	result := initializers.DB.Model(&models.Buildings{}).Select("Propertyname").Offset(offset).Limit(perPage).Find(&buildings)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	var totalItem int64
	initializers.DB.Model(&models.Buildings{}).Count(&totalItem)
	fmt.Println(totalItem)
	// var totalPage int64
	totalPages := int(math.Ceil(float64(totalItem) / float64(perPage)))

	// Return the fetched data as a JSON response
	c.JSON(http.StatusOK, gin.H{
		"buildings":  buildings,
		"totalItem":  totalItem,
		"totalPages": totalPages,
	})
}

// API to get the building details
func GetBuildingDetails(c *gin.Context) {
	// Get the "name" parameter from the query string
	propertyName := c.Query("name")

	// Fetch the data from the database
	var building models.Buildings

	result := initializers.DB.Model(&models.Buildings{}).
		Select("Propertyname", "Primarypropertytype", "Address", "City", "Numberoffloors", "Councildistrictcode", "Yearbuilt", "Latitude", "Longitude").
		Where("Propertyname = ?", propertyName).
		Find(&building)

	// Handle errors while fetching data from the database
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Return the fetched data as a JSON response
	c.JSON(http.StatusOK, gin.H{
		"Building": building,
	})
}

// API to get the list of building informations
func GetBuildingsByParams(c *gin.Context) {
	// Get the "primarypropertytype" parameter from the query string
	primaryPropertyType := c.Query("primarypropertytype")

	// Get the "yearbuilt" parameter from the query string
	yearBuilt := c.Query("yearbuilt")

	// Get the "councildistrictcode" parameter from the query string
	councilDistrictCode := c.Query("councildistrictcode")

	// Fetch the data from the database
	var buildings []models.Buildings

	dbQuery := initializers.DB.Model(&models.Buildings{}).
		Select("Propertyname", "Primarypropertytype", "Address", "City", "Numberoffloors", "Councildistrictcode", "Yearbuilt", "Latitude", "Longitude")

	if primaryPropertyType != "" {
		dbQuery = dbQuery.Where("Primarypropertytype = ?", primaryPropertyType)
	}

	if yearBuilt != "" {
		dbQuery = dbQuery.Where("Yearbuilt = ?", yearBuilt)
	}

	if councilDistrictCode != "" {
		dbQuery = dbQuery.Where("Councildistrictcode = ?", councilDistrictCode)
	}

	result := dbQuery.Find(&buildings)

	// Handle errors while fetching data from the database
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Return the fetched data as a JSON response
	c.JSON(http.StatusOK, gin.H{
		"Buildings": buildings,
	})
}

// API to get average EUI (round to 3 decimals)
func GetAverageEUI(c *gin.Context) {

	// Execute the SQL query to calculate the EUI for each building
	rows, err := initializers.DB.Raw(`
		SELECT
			t.PrimaryPropertyType AS type,
			AVG(m.value / gfa.PropertyUseTypeGFA) AS average_eui
		FROM buildings t
		LEFT JOIN (
			SELECT OSEBuildingID AS id, SUM(PropertyUseTypeGFA) AS PropertyUseTypeGFA
			FROM buildings_gfa
			GROUP BY OSEBuildingID
		) gfa ON t.OSEBuildingID = gfa.id
		LEFT JOIN metrics m ON t.OSEBuildingID = m.OSEBuildingID
		WHERE m.metric = 'Electricity'
		GROUP BY t.PrimaryPropertyType;
		`).Rows()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	// Iterate over the query results and build a map of average EUIs by property type
	averageEUIs := make(map[string]float64)
	for rows.Next() {
		var propertyType string
		var averageEUI float64
		err := rows.Scan(&propertyType, &averageEUI)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		averageEUIs[propertyType] = averageEUI
	}
	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Round the average EUIs to 3 decimals
	for propertyType, averageEUI := range averageEUIs {
		averageEUIs[propertyType] = math.Round(averageEUI*1000) / 1000
	}

	// Return the map of average EUIs to the client
	c.JSON(http.StatusOK, averageEUIs)
}
