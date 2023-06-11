package main

import (
	"api/controllers"
	"api/middleware"

	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func OptionMessage(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "http://localhost:8081")
	c.Header("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT")
}

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	r := gin.Default()
	// r.Use(cors.New(cors.Config{
	// 	AllowOrigins: []string{"http://localhost:3000"},
	// 	AllowMethods: []string{"POST", "GET", "OPTIONS", "PUT", "DELETE"},
	// 	AllowHeaders: []string{"Content-Type"},
	// }))
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Content-Length", "Authorization"}
	config.AllowCredentials = true // add this line to enable credentials

	r.Use(cors.New(config))

	r.POST("/login", controllers.Login)

	r.GET("/ping", middleware.RequireAuth, func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.GET("/overview", middleware.RequireAuth, controllers.GetBuildings)
	r.Run(":8081") // listen and serve on 0.0.0.0:8081
}
