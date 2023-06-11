package controllers

import (
	"api/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func GetBuildings(c *gin.Context) {
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
	result := db.Model(&models.Buildings{}).Select("PropertyName, City").Find(&buildings)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Return the fetched data as a JSON response
	c.JSON(http.StatusOK, gin.H{
		"buildings": buildings,
	})
}
