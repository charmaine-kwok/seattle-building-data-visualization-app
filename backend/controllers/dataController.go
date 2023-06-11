package controllers

import (
	"api/models"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func GetBuildings(c *gin.Context) {
	// Get the "page" parameter from the query string, with a default value of 1
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Calculate the offset
	const perPage = 20
	offset := (page - 1) * perPage

	// Connect to the database
	db, err := gorm.Open(sqlite.Open("../data.db"), &gorm.Config{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalln(err)
	}
	defer sqlDB.Close()

	// Fetch the data from the database
	var buildings []models.Buildings
	result := db.Model(&models.Buildings{}).Select("PropertyName, City").Offset(offset).Limit(perPage).Find(&buildings)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	var totalItem int64
	db.Model(&models.Buildings{}).Count(&totalItem)

	// Return the fetched data as a JSON response
	c.JSON(http.StatusOK, gin.H{
		"buildings": buildings,
		"totalItem": totalItem,
	})
}
