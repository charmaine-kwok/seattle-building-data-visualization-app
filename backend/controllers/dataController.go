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

func GetBuildingsDetails(c *gin.Context) {
	// Get the "PropertyName" parameter from the query string
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
